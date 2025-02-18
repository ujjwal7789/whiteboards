This is a Collaborative Whiteboard, a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Live Demo

Access the live app here : [Collaborative Whiteboard](https://whiteboards-three.vercel.app/)

## Features
- Create or join a shared whiteboard session using room ID.
- Sketch on the whiteboard in real time.
- Collaborate with other users by seeing their changes in real time.
- Save and load whiteboard sessions for later use.
- Real-time communication and synchronization of whiteboard updates across users.
- Whiteboard session management using room ID.
- Persistent storage of whiteboard sessions and user data.

## Screenshots

   ![](images/mainscreen.png)
   ![](images/loginform.png)
   ![](images/signupform.png)
   ![](images/drawing.png)
     



## Technologies Used
- Frontend: Next.js, React
- Backend: Render
- Deployment: Vercel
- Styling: Tailwind CSS

## Getting Started
### Installation

1. Clone the repository
   `git clone https://github.com/ujjwal7789/whiteboards.git`  
   `cd whiteboards`

2. Install dependencies for frontend:
   `npm install`

3  Install dependencies for backend:
   `cd server`
   `npm install`
   
4. Set up environment variables:
   Create a `.env` file in the root directory and add:
   `DATABASE_URL = your-render-database-url`

5. Change backend and frontend servers accordingly

6. Start the development server for frontend:
   `npm run dev`

7. Start development server for backend:
   `node index.js`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Contributions

Contributions are welcome. To contribute:

1. Fork the repository.
2. Create a new branch:

`git checkout -b feature-name` 

Make your changes and commit:

`git commit -m "Add feature-name"`  

Push to the branch:

`git push origin feature-name`  

Open a pull request.

## Acknowledgements

- Thanks to Vercel and Render for providing free hosting!
- Inspired by the creativity and collaboration of online tools.


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
