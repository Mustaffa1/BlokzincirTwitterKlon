import React from 'react';
import { useOutletContext } from 'react-router-dom';
import TweetForm from '../components/TweetForm';
import TweetList from '../components/TweetList';

function Home() {
  const { tweets, fetchTweets, currentUser } = useOutletContext();

  return (
    <div>
      <TweetForm onTweetSent={fetchTweets} avatar={currentUser?.avatar} />
      <TweetList tweets={tweets} />
    </div>
  );
}

export default Home;
