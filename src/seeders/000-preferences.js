'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('preferences', [
      {
        name: 'site_title',
        value: 'Reader Front',
        group: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'lang_default',
        value: 'es',
        group: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'api_url',
        value: 'http://localhost:8000/',
        group: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'frontend_url',
        value: 'http://localhost:3000/',
        group: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'in_maintenance',
        value: null,
        group: 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'reg_disabled',
        value: null,
        group: 'advanced',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'reg_email_activation_disabled',
        value: null,
        group: 'advanced',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'dl_enabled',
        value: '1',
        group: 'advanced',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'dl_archive_max',
        value: '350',
        group: 'advanced',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'disqus_shortname',
        value: null,
        group: 'advanced',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'google_analytics_id',
        value: null,
        group: 'advanced',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'discord_id',
        value: null,
        group: 'advanced',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'patreon_username',
        value: null,
        group: 'advanced',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('preferences', null, {});
  }
};
