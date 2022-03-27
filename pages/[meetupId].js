import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from '../components/meetups/MeetupDetail';

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

// Required if we use getStaticProps in a dynamic([]) page
// Provides all possible paths - id's - that need to be pre-generated
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    'mongodb+srv://admin:2KvYKsTn3RKd8N9E@cluster0.nweio.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();
  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray(); // find and return ALL _id's from all objects
  client.close();

  return {
    fallback: false, // this means the paths object contains ALL the supported id values --> any id entered outside of the paths object will receive a 404 error
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

// this pre-populates the pag with data or faster loading WITH data
// the page is prepared at build time - with revalidate specified, it will update its information at preset intervals - 10s in this case
// Because the meetupId is generated during the actual visit - we need to prepare all possible routes (id values) that the user may enter --> getStatic Paths above, does precisely this
export async function getStaticProps(context) {
  //fetch one meetup from from API --> requires meetup ID, which we have access to in the url params
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    'mongodb+srv://admin:2KvYKsTn3RKd8N9E@cluster0.nweio.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();
  const meetupsCollection = db.collection('meetups');
  const singleMeetUp = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  }); // finds single meetup

  client.close();

  return {
    props: {
      meetupData: {
        id: singleMeetUp._id.toString(), // because of the convoluted Mongo Id, we need to explicitly type the object like this to convert id into a readable string
        title: singleMeetUp.title,
        image: singleMeetUp.image,
        description: singleMeetUp.description,
        address: singleMeetUp.address,
      },
    },
    revalidate: 10,
  };
}

export default MeetupDetails;
