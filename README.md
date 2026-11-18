This is an Appointment App bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

<img width="512" height="931" alt="image" src="https://github.com/user-attachments/assets/29c90f45-0648-4705-b2c2-106a85a2eaf8" />


## Prerequisites

- Docker
- Node.js 20 (or later)

## Running the app

First, rename the `.env.example` file to `.env`.

Then, run the following command to start the database, seed it and start the app:

```bash
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stopping the app

To stop the app and destroy its containers, run the following command:

```bash
docker compose down
```
