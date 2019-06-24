# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [0.4.0](https://github.com/dvaJi/ReaderFront-API/compare/v0.3.0...v0.4.0) (2019-06-24)


### Bug Fixes

* **package:** update dotenv to version 7.0.0 ([#45](https://github.com/dvaJi/ReaderFront-API/issues/45)) ([7b98e73](https://github.com/dvaJi/ReaderFront-API/commit/7b98e73))
* .snyk & package.json to reduce vulnerabilities ([#42](https://github.com/dvaJi/ReaderFront-API/issues/42)) ([fcb5aff](https://github.com/dvaJi/ReaderFront-API/commit/fcb5aff))
* chapters are not being filtered by language in Work view ([#49](https://github.com/dvaJi/ReaderFront-API/issues/49)) ([22f5447](https://github.com/dvaJi/ReaderFront-API/commit/22f5447))
* downloads still using old path ([#51](https://github.com/dvaJi/ReaderFront-API/issues/51)) ([966f458](https://github.com/dvaJi/ReaderFront-API/commit/966f458))
* **package:** update sequelize to version 5.1.0 ([#46](https://github.com/dvaJi/ReaderFront-API/issues/46)) ([af3bfad](https://github.com/dvaJi/ReaderFront-API/commit/af3bfad))


### Features

* implement endpoint to delete old archives ([#43](https://github.com/dvaJi/ReaderFront-API/issues/43)) ([ac272c5](https://github.com/dvaJi/ReaderFront-API/commit/ac272c5))
* implement usage of CDNs for images ([#47](https://github.com/dvaJi/ReaderFront-API/issues/47)) ([78b860c](https://github.com/dvaJi/ReaderFront-API/commit/78b860c))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/dvaJi/ReaderFront-API/compare/v0.2.0...v0.3.0) (2019-02-25)


### Bug Fixes

* add file size limit ([#30](https://github.com/dvaJi/ReaderFront-API/issues/30)) ([773fcc9](https://github.com/dvaJi/ReaderFront-API/commit/773fcc9))
* allow to configure graphiql and database logging from env ([c2f34a5](https://github.com/dvaJi/ReaderFront-API/commit/c2f34a5))
* chapter url didn't work for rss ([d2611e2](https://github.com/dvaJi/ReaderFront-API/commit/d2611e2))
* chapters are sorted correctly with the column releaseDate ([#32](https://github.com/dvaJi/ReaderFront-API/issues/32)) ([c32f466](https://github.com/dvaJi/ReaderFront-API/commit/c32f466))
* set uniqid after create chapter ([#26](https://github.com/dvaJi/ReaderFront-API/issues/26)) ([c2c244b](https://github.com/dvaJi/ReaderFront-API/commit/c2c244b))
* thumb_logs were not being removed when a page was deleted from admincp ([#34](https://github.com/dvaJi/ReaderFront-API/issues/34)) ([504c3f7](https://github.com/dvaJi/ReaderFront-API/commit/504c3f7))
* use node env as second option to use graphiql ([3a3e3f4](https://github.com/dvaJi/ReaderFront-API/commit/3a3e3f4))
* **package:** update nodemailer to version 5.1.1 ([722e8ab](https://github.com/dvaJi/ReaderFront-API/commit/722e8ab))
* **user:** only administrator can fetch users data ([#40](https://github.com/dvaJi/ReaderFront-API/issues/40)) ([ad0f8fe](https://github.com/dvaJi/ReaderFront-API/commit/ad0f8fe))


### Features

* **reader:** add new query and chapter getByWork will fetch pages only if pages is given in fields ([#37](https://github.com/dvaJi/ReaderFront-API/issues/37)) ([d5c4c73](https://github.com/dvaJi/ReaderFront-API/commit/d5c4c73))
* better feed configuration ([#41](https://github.com/dvaJi/ReaderFront-API/issues/41)) ([a72e6d3](https://github.com/dvaJi/ReaderFront-API/commit/a72e6d3))
* new feed links (rss, json and atom) ([206bf7b](https://github.com/dvaJi/ReaderFront-API/commit/206bf7b))


### Performance Improvements

* **works:** improve resolvers to only use joins when are necessary ([#27](https://github.com/dvaJi/ReaderFront-API/issues/27)) ([c4c47d5](https://github.com/dvaJi/ReaderFront-API/commit/c4c47d5))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/dvaJi/ReaderFront-API/compare/v0.1.0...v0.2.0) (2018-11-11)


### Bug Fixes

* add cascade on delete works and chapters ([#19](https://github.com/dvaJi/ReaderFront-API/issues/19)) ([194e79c](https://github.com/dvaJi/ReaderFront-API/commit/194e79c))
* change stub to work like foolslider one ([#23](https://github.com/dvaJi/ReaderFront-API/issues/23)) ([8636d2c](https://github.com/dvaJi/ReaderFront-API/commit/8636d2c))
* use env config for emails ([#22](https://github.com/dvaJi/ReaderFront-API/issues/22)) ([830c70c](https://github.com/dvaJi/ReaderFront-API/commit/830c70c))
* works, chapters and posts can be hidden ([#20](https://github.com/dvaJi/ReaderFront-API/issues/20)) ([cdb7c46](https://github.com/dvaJi/ReaderFront-API/commit/cdb7c46))


### Features

* **RSS:** add rss support ([#16](https://github.com/dvaJi/ReaderFront-API/issues/16)) ([fd114a1](https://github.com/dvaJi/ReaderFront-API/commit/fd114a1))
* add compression lib to reduce size ([#21](https://github.com/dvaJi/ReaderFront-API/issues/21)) ([2bd6191](https://github.com/dvaJi/ReaderFront-API/commit/2bd6191))
* add SendGrid to handle SMTP ([#24](https://github.com/dvaJi/ReaderFront-API/issues/24)) ([2211521](https://github.com/dvaJi/ReaderFront-API/commit/2211521))
* chapters are sorted by releaseDate column ([#18](https://github.com/dvaJi/ReaderFront-API/issues/18)) ([0d71095](https://github.com/dvaJi/ReaderFront-API/commit/0d71095))
* thumbs from chapter can be cleaned to free up disk space ([#25](https://github.com/dvaJi/ReaderFront-API/issues/25)) ([ff41fbe](https://github.com/dvaJi/ReaderFront-API/commit/ff41fbe))
* use environment variables instead plain js config ([#17](https://github.com/dvaJi/ReaderFront-API/issues/17)) ([a5546a3](https://github.com/dvaJi/ReaderFront-API/commit/a5546a3))



<a name="0.1.0"></a>
# 0.1.0 (2018-10-14)


### Features

* **admincp:** add chapters ([#10](https://github.com/dvaJi/ReaderFront-API/issues/10)) ([35bd65b](https://github.com/dvaJi/ReaderFront-API/commit/35bd65b))
* **admincp:** add posts ([#11](https://github.com/dvaJi/ReaderFront-API/issues/11)) ([8b4d73c](https://github.com/dvaJi/ReaderFront-API/commit/8b4d73c))
* **admincp:** works ([#8](https://github.com/dvaJi/ReaderFront-API/issues/8)) ([7e7e4bd](https://github.com/dvaJi/ReaderFront-API/commit/7e7e4bd))
* **auth:** accounts must be activated by email ([#6](https://github.com/dvaJi/ReaderFront-API/issues/6)) ([5f5ddd6](https://github.com/dvaJi/ReaderFront-API/commit/5f5ddd6))
* **Blog:** New blog api added ([1c6687a](https://github.com/dvaJi/ReaderFront-API/commit/1c6687a))
* **Blog:** New blog api added ([ecaf8c5](https://github.com/dvaJi/ReaderFront-API/commit/ecaf8c5))
* **core:** Add 'preferences' table containing all site settings ([34ae9a1](https://github.com/dvaJi/ReaderFront-API/commit/34ae9a1))
* **core:** Add 'preferences' table containing all site settins ([ef38c15](https://github.com/dvaJi/ReaderFront-API/commit/ef38c15))
* **core:** generate thumbnails dynamically ([#12](https://github.com/dvaJi/ReaderFront-API/issues/12)) ([251b26c](https://github.com/dvaJi/ReaderFront-API/commit/251b26c))
* **Reader:** chapters now can be downloaded ([#14](https://github.com/dvaJi/ReaderFront-API/issues/14)) ([b2f065d](https://github.com/dvaJi/ReaderFront-API/commit/b2f065d))
