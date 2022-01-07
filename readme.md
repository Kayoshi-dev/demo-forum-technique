# demo-forum-technique
![Preview of the blog, showing different article on a web page](https://i.ibb.co/3YHdDr2/localhost-3000-1.png)

## Context

This project is made to introduce people to the concept of Jamstack and Headless CMS. It is intended for professionnal worker and Information System Director.

## Features :

- Create new post and assign categories to them !
- Create new categories and filter your posts by them (comming soon)
- Use the table of content to navigate easily through a post

## Technologies 

Frontend part is using NextJS with Incremental Static Regeneration and Server Side Rendering, it communicates with the API with GraphQL.

The backend is made with Strapi which is a simple and elegant Headless CMS, and it exposes a GraphQL endpoint allowing the front to request the data.

## Run locally :

How to run this project :

1. Run `git clone https://github.com/Kayoshi-dev/demo-forum-technique.git`
2. Run `yarn install` command in both directories (frontend and api)
3. Run `yarn develop` in the api folder and access to Strapi at http://localhost:1337
4. Create a .env.local file in the frontend folder and set NEXT_PUBLIC_API_URL to http://localhost:1337/graphql
5. Run `yarn dev` in the frontend folder and access NextJS at http://localhost:3000
6. Enjoy !
