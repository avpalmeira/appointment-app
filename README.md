This is an Appointment App bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Prerequisites

- Docker
- Node.js 20 (or later)

## Running the app

First, rename the `.env.example` file to `.env`.

Then, run the following command to start the app and the database:

```bash
docker compose up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stopping the app

To stop the app and destroy its containers, run the following command:

```bash
docker compose down
```
