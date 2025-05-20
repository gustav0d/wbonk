<div id="top"></div>

# WBonk

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version" />
</p>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#postman">Postman</a></li>
        <li><a href="#graphiql">GraphiQL Playground</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About the Project

<p align="center">
  <strong>WBonk is a modern banking application that allows users to send transactions.</strong>
</p>

WBonk provides a full-featured banking platform with the following capabilities:

- Account management with user authentication
- Transaction history and tracking
- Money transfers between accounts
- User-friendly dashboard experience
- Secure API with GraphQL and JWT authentication

The application consists of a React frontend with a Node.js backend, using GraphQL for API requests and MongoDB for data storage.

### Built With

[![React][react.js]][react-url]
[![Node][node.js]][node-url]
[![GraphQL][graphql]][graphql-url]
[![MongoDB][mongodb]][mongodb-url]
[![Koa][koa]][koa-url]

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js

  ```sh
  https://nodejs.org/en/download/
  ```

- PNPM

  ```sh
  npm install pnpm -g
  ```

- Docker

  ```sh
  https://www.docker.com/get-started/
  ```

### Installation

1. Clone the repository

   ```sh
   git clone https://github.com/gustav0d/wbonk.git
   cd wbonk
   ```

2. Install dependencies

   ```sh
   pnpm install
   ```

3. Configure environment

   ```sh
   pnpm config:local
   ```

4. Compile relay on the frontend

   ```sh
   pnpm --filter @wbonk/web relay
   ```

5. Run containers

   ```sh
   pnpm compose:up
   ```

6. Start the development servers

```sh
pnpm dev
```

The web application will be available at `http://localhost:5173`
The server application will be available at `http://localhost:3000`

### Postman

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/31618362-38efaddd-785a-43af-94d8-5ce938781e6e?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D31618362-38efaddd-785a-43af-94d8-5ce938781e6e%26entityType%3Dcollection%26workspaceId%3D4900b586-8375-4755-b31a-1737c1537f91)

### GraphiQL

You can start GraphQL playground both on the server or on the web.

- The web playground will be available on `http://localhost:5173/playground` automatically

- To run on the server (you will need to install `ruru`)

  ```sh
  pnpm --filter @wbonk/server graphiql
  ```

- this one will be available at `http://localhost:3001/graphql`

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'feat(amazing-feature): my feature is awesome'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## References

- [turbo](https://turbo.build/repo/docs/getting-started/add-to-existing-repository)
- [woovi-playground](https://github.com/woovibr/woovi-playground)
- [@hallexcosta challenge](https://github.com/hallexcosta/woovi-fullstack-challenger)
- [@Eckzzo notdiscord](https://github.com/Eckzzo/notdiscord/)
- [@sibelius relay-realworld](https://github.com/sibelius/relay-realworld/)

<!-- CONTACT -->

## Contact

[Contact me](https://bento.me/dantas)

Project Link: [https://github.com/gustav0d/wbonk](https://github.com/gustav0d/wbonk)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[node.js]: https://img.shields.io/badge/NodeJS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[node-url]: https://nodejs.org/
[graphql]: https://img.shields.io/badge/Graphql-E10098?style=for-the-badge&logo=graphql&logoColor=white
[graphql-url]: https://graphql.org/
[mongodb]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[mongodb-url]: https://mongodb.com
[koa]: https://img.shields.io/badge/Koa-F9F9F9?style=for-the-badge&logo=koa&logoColor=33333D
[koa-url]: https://koajs.com
