<h1 align="center" id="title">Conquerer</h1>

<p align="center"><img src="https://socialify.git.ci/yusufokkabas/conquerer/image?language=1&amp;owner=1&amp;name=1&amp;&amp;theme=Dark" alt="project-image"></p>

<p id="description">This project involves developing a backend for a blog application using REST APIs. Users can create read update and delete blog posts as well as comment on others’ posts. The application features user authentication with JWT-based sessions lasting one hour. It uses a PostgreSQL database to manage user blog post and comment data and includes ElasticSearch indexes for category-wise post statistics user engagement metrics and post timing analysis.</p>

<h2>🛠️ Installation Steps:</h2>

```
git clone https://github.com/yusufokkabas/idssbackend.git
```

```
npm install
```

```
npm install sequelize-cli
```

```
npx sequelize-cli init
```

```
configure the database connection on config/config.json
```

```
npx sequelize-cli db:migrate
```

  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   Node.js(Express)
*   PostgeSQL
*   Sequelize.js(ORM)
*   JOI(form validation)
*   JWT(Authentication)
*   node-sessions
*   ElasticSearch
