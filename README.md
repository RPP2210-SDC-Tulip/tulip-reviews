# Reviews Microservice System Design for Atelier

## Overview:
This project replaced the legacy API for an e-commerce website with a more efficient backend system.

## Tech Stack:
![Javascript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=323330)
![Node.Js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-00ff00?style=for-the-badge&logo=express&logoColor=808080)
![PostgreSQL](https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white)
![Chai](https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai&logoColor=white)
![K6](https://img.shields.io/badge/K6-7D64FF?style=for-the-badge&logo=k6&logoColor=white)
![NewRelic](https://img.shields.io/badge/new%20relic-1DE883?style=for-the-badge)
![Loader.io](https://img.shields.io/badge/loader.io-4579B6?style=for-the-badge)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=FF9900)

## Table of Contents:
- [Description](#Description)
- [Usage](#Usage)
- [Installation](#Installation)
- [Tech Stack](#Tech-Stack)
- [Contributor](#Contributor)
- [License](#License)

## Description:
This backend system architecture for a preexisting e-commerce web-portal focused on supporting the full dataset for the existing front-end architecture and performing at a rate of at least 1,000 client requests per second under a 1% error rate in production.

This project included completing an ETL process for the client-provided dataset, building efficint API routes to communicate with a PostgreSQL database, and implementing data-driven performance optimizations including load balancing and caching.

In a production environment consisting of 5 AWS EC2 t2.micro instances (1 PostgreSQL database, 1 NGINX load balancer, 3 Node.js servers), this backend service exceeds the bare minimum client expectations, as it is able to handle over **6,000rps** with **<1% error rate** in production.

System peak performance **_before_** optimizations:

![](https://user-images.githubusercontent.com/113475539/253711534-3d0acf82-65bd-4bbd-bca5-014e1b9fe0f7.png)

System peak performance **_after_** optimizations:

![](https://user-images.githubusercontent.com/113475539/253711530-3e4ff928-4cec-4314-b63a-d8ccfdc188da.png)

Database schema diagram:

![](https://user-images.githubusercontent.com/113475539/253711536-cb4f9069-7804-4448-9524-7e292c873869.jpeg)

## Usage:
This project provides the backend system architecture for the ratings and reviews portion of a preexisting ecommerce web-site.

## Installation:
Information available upon request.

## Contributor:
- [Rachel Quirbach](https://github.com/rquirbach)

## License:
None
