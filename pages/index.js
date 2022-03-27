import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';

const DUMMY_MEETUPS = [
  {
    id: 'm1',
    title: 'first Meetup',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Thomas_Wolfe%27s_Home.jpg/400px-Thomas_Wolfe%27s_Home.jpg',
    address: '1024 Some Street, Suburb, Jozi, 2000',
    description: 'This is the First Meetup',
  },
  {
    id: 'm2',
    title: 'second Meetup',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/2019_02_Rustic_Barista_Specialty_Coffee_Korat_01.jpg/440px-2019_02_Rustic_Barista_Specialty_Coffee_Korat_01.jpg',
    address: '1024 Some Street, Suburb, Jozi, 2000',
    description: 'This is the Second Meetup',
  },
];

function Home(props) {
  // passed in from the getStaticProps function below, which runs before this component loads

  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React Meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}

// this code doesn't run on the client side
// fetches data for the Primary Component, gets executed first, and so when the component first loads, it does so with
// required data in state
// IDEAL FOR INFORMATION THAT CHANGES INFREQUENTLY --> GENERATES HTML PAGE THAT CAN BE CACHED AND THUS
// NO NEED TO REGENERATE SAME PAGE(INFORMAITON) REPEATEDLY
export async function getStaticProps() {
  //fetch data from an API
  const client = await MongoClient.connect(
    'mongodb+srv://admin:2KvYKsTn3RKd8N9E@cluster0.nweio.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();
  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    //always return an object
    props: {
      // this returned key HAS to be named "props"
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 10, // this regenerates props, fetches newer props every 10 seconds.
  }; // to ensure that, Static props, which are generated during the build process
} // are updated to reflect new information. time frequency depends on the nature of the application.

// //An alternative to getStaticProps --> runs on the server with EACH request...no need to revalidate to update served data
// IDEAL FOR INFORMATION THAT CHANGES FREQUENTLY
// export default async getServerSideProps(context) {
//     const req = context.req
//     const res = context.res

//     // fetch data from an API

//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

export default Home;
