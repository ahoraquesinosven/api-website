'use strict';

const featuredContentTypes = [
  { table: 'activities', kind: 'activity', mainDate: 'dateTime' },
  { table: 'media_presences', kind: 'media_presence', mainDate: 'publicationDate'},
  { table: 'reports', kind: 'report', mainDate: 'toDate'},
  { table: 'campaigns', kind: 'campaign', mainDate: 'launchDate'},
  { table: 'articles', kind: 'article', mainDate: 'articleDate'},
];



module.exports = {
  index: async (ctx) => {
    const sql = strapi.connections.default;


    const contentQueries = featuredContentTypes.map(content => sql
      .select([
        'id',
        'created_at',
        'updated_at',
        'title',
        'summary',
        'slug',
        sql.raw('? as ??', [content.kind, 'kind']),
        sql.raw('? as ??', [content.table, 'related_type']),
        sql.raw('?? as ??', [content.mainDate, 'main_date']),
      ])
      .from(content.table)
    );

    const allContent = contentQueries.reduce((result, query) => result.union(query));

    return sql
      .with('all_content', allContent)
      .select([
        'content.id',
        'content.created_at',
        'content.updated_at',
        'content.title',
        'content.summary',
        'content.slug',
        'content.kind',
        { mainDate: 'content.main_date' },
        { mainImageUrl: 'image.url' },
        { mainImageAlt: 'image.alternativeText' },
      ])
      .from({ content: 'all_content' })
      .leftJoin({ contentImage: 'upload_file_morph' }, {
        'content.id': 'contentImage.related_id',
        'content.related_type': 'contentImage.related_type',
        'contentImage.field': sql.raw('?', ['mainImage']),
      })
      .leftJoin({ image: 'upload_file' }, {
        'contentImage.upload_file_id': 'image.id'
      })
      .orderBy('main_date', 'desc')
      .limit(ctx.query._limit || 10);
  }
};
