import React from 'react';
import * as styles from '../styles.module.css';
import { SampleChapterSignupForm, withHidden } from '../components/SignupForms';
import Layout from '../components/layout';
// import Countdown from 'react-countdown-now'
import webpackConfigImg from '../../images/webpack-config.png';
import dependencyImg from '../../images/dependency-hell-overlay.png';
import speedImg from '../../images/100-on-speed.png';
import profileImg from '../../images/profile-pic.jpg';

export const HiddenSampleChapterSignupForm = withHidden(
  SampleChapterSignupForm,
  'Get a sample chapter'
);

const BuyButton = () => (
  <a
    href="https://transactions.sendowl.com/products/77947612/04BA2522/purchase"
    rel="nofollow"
    className={styles.myButton}
  >
    Buy Now for $24
  </a>
);

/* const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span>Time's out</span>
  } else {
    return (
      <span>
        {days} days, {hours} hours and {minutes} minutes
      </span>
    )
  }
}
const Discount = () => (
  <div className={styles.discountBox}>
    Spring sale! Use the discount code <span>spring</span> in the checkout to
    get 25% off. <br />
    Discount expires in{' '}
    <Countdown date={new Date('2019-04-12T00:00:00')} renderer={renderer} />
  </div>
) */

export default () => {
  return (
    <Layout title="Learn webpack">
      <div className={styles.webpackConfigContainer}>
        <h1 className={styles.large}>Learn webpack</h1>
        <h2 className={styles.subtitle}>A handbook for webpack beginners</h2>
        <div className={styles.center}>
          <a href="#buy" className={styles.myButton}>
            Buy Now
          </a>
          <p>
            <HiddenSampleChapterSignupForm />
          </p>
        </div>
        <h3>Setting up an app with webpack shouldn't be this complex</h3>
        <p style={{ marginBottom: 0 }}>
          The heart of webpack — the <code>webpack.config.js</code> — has a
          syntax that probably makes sense for hackers on the internals of
          webpack. But for devs just wanting to create a new project, it's a
          nightmare to write.
        </p>
        <img
          alt="webpack config wtf"
          src={webpackConfigImg}
          width="100%"
          style={{ textAlgin: 'center' }}
        />
        <p style={{ marginTop: 0 }}>
          You see keywords like <code>module</code>, <code>rules</code>,{' '}
          <code>use</code>, <code>entry</code>, <code>plugins</code>. But what
          does that all even mean in the context of a build setup for a web app?
        </p>
        <p>
          You stumble around with webpack, browsing the docs, tutorials, blogs,
          YouTube and Stack Overflow to try to make sense of it all. And you're
          really struggling.
        </p>
        <p>
          <i>
            The problem is that every tutorial has its own creative way of
            configuring webpack.
          </i>
        </p>
        <p>
          One tutorial tells you to use the <code>html-webpack-plugin</code>{' '}
          (whatever that is?) and another tutorial doesn't mention that at all.
        </p>
        <p>
          One tutorial uses <code>babel-preset-env</code> and another uses
          something else.
        </p>
        <p>
          There just doesn't seem to be one standard way of implementing
          anything with webpack. This makes it very difficult to know what is
          the best practice way to configure it.
        </p>
        <p>
          You know that webpack is a really powerful tool, it's just so time
          consuming to figure out how it works.
        </p>
        <h3>
          When you know webpack on a deeper level a new world in frontend
          ecosystem opens up for you:
        </h3>
        <p>
          <b>
            ➡️ You'll know how create-react-app, Gatsby, Next.js, etc work under
            the hood
          </b>
        </p>
        <p>
          Make sense of the ejected create-react-app webpack config. Know how to
          extend it and adjust it to your needs. Extend Gatsby in gatby-node.js
          with ease.
        </p>
        <p>
          <b>
            ➡️ Master the webpack config. Know how it works without having to
            google everything
          </b>
        </p>
        <p>
          And in those cases when you get stuck, you know what to google for and
          interpret the result. You are able to not only read and understand the
          webpack docs but you'll enjoy it.
        </p>
        <p>
          <b>
            ➡️ Become a better dev to get better chances of getting the job you
            want
          </b>
        </p>
        <p>
          Stand out from other devs on the team and be the go-to guy when it
          comes to setting up new frontend apps. Raise your overall knowledge
          level. Apply for senior engineers roles that expect deep webpack
          knowledge.
        </p>
        <h3>Learn webpack from the ground up with "Learn webpack ebook"</h3>
        <p>
          Learn webpack is an e-book designed to make the process of learning
          webpack as quick and smooth as possible for you.
        </p>
        <p>
          To <i>deeply</i> learn webpack, you’ll start with a clean slate. No
          more copy-pasting boilerplates and ejecting CRA to try to figure out
          things backward. You’ll start with an empty editor and you'll write
          the whole <code>webpack.config.js</code> yourself.
        </p>
        <p>
          You will learn step-by-step how to build the{' '}
          <code>webpack.config.js</code>, <code>package.json</code>,{' '}
          <code>.babelrc</code> and all other files required to build a modern
          web app with webpack. This approach makes webpack super easy to learn.
        </p>
        <p>
          But it’s not enough just to learn the syntax. You’ll learn all about
          the dependencies like Babel, webpack-dev-server, and React hot loader.
          You learn what they do and why you need them. This way you can use the
          dependencies to your advantage, to make your app fast and beautiful
          for your users.
        </p>
        <p>
          You’ll also learn how to squeeze out every juice of webpack to make
          your app as fast as possible by using advanced techniques such as code
          splitting and tree shaking.
        </p>
        <p>
          This is a <i>complete</i> and <i>up-to-date</i> book for webpack
          beginners. It covers the latest stable version of webpack which is
          version 5.
        </p>
        <h3>What does the book cover?</h3>
        <p>
          This book is a handbook for creating enterprise-ready production apps
          with webpack. These are the main topics covered:
        </p>
        <ul>
          <li>Why do you need webpack?</li>
          <li>Getting started tutorial</li>
          <li>
            What happens under-the-hood? A deep dive into loaders, plugins,
            manifests, etc.
          </li>
          <li>An introduction to NPM and package.json</li>
          <li>How to configure separate prod and test configs</li>
          <li>More than one output for SSR and public/admin sites</li>
          <li>Create an awesome dev experience</li>
          <li>Optimized production builds to get a small bundle size</li>
          <li>Code splitting to make faster apps</li>
          <li>Caching for quicker load speeds</li>
          <li>What is tree shaking and how to use it to create fast apps</li>
          <li>How to enable source maps for better debugging experience</li>
          <li>A bunch of recipes for React, Vue, Typescript, etc</li>
        </ul>
        <div>
          <a href="https://s3-eu-west-1.amazonaws.com/jakoblind/Learn+webpack+TOC.pdf">
            Read the full table of contents here
          </a>
        </div>
        <p>The book is made up of three parts:</p>
        <p>
          <b>Part 1: The Getting started tutorial </b>
          You'll jump straight into coding your first React app with webpack.
          You start from scratch and you will finish up with a complete webpack
          project that you can put in production. This tutorial is designed to
          get you up and running quickly.
        </p>
        <p>
          <b>Part 2: Production-ready apps with webpack </b>
          You’ll learn how to configure an awesome developer experience that
          makes you super productive <i>and</i> use tools and techniques to get
          the lowest possible bundle size for the production build. You’ll also
          learn about the internals of webpack. Loaders, plugins, manifests and
          chunks will no longer feel like magic
        </p>
        <p>
          <b> Part 3: Recipes</b> Even the webpack pros have to look up how to
          configure specific things like Vue, React, Typescript, etc. In this
          part of the book, you will have recipes that you can use to create the
          app you want to create - so you don't have read long and outdated
          medium-articles to get the code you need.
        </p>
        <div>
          <HiddenSampleChapterSignupForm />
        </div>
        <div style={{ clear: 'both' }} />
        <p>
          <i>Zero fluff guaranteed</i>
        </p>
        <p>
          This is a short book - only 100 pages. It's to the point. And it has
          absolutely zero fluff - just actionable advice.{' '}
        </p>
        <h3 id="buy">Buy Learn webpack</h3>
        <p>
          As a developer, the best investment you can make is to invest in your
          skills. When you know webpack you will be a more complete frontend
          dev. It will set you up for getting promotions.
        </p>
        <p>
          And if you're looking for a job, talking fluently in interviews about
          how to use code splitting and tree shaking with webpack will make you
          stand out from other frontend devs.
        </p>
        <h3>Book details</h3>
        <table className={styles.productTable}>
          <tr>
            <td>
              <b>Length:</b>
            </td>
            <td>100 pages</td>
          </tr>
          <tr>
            <td>
              <b>Format:</b>
            </td>
            <td>PDF and EPUB</td>
          </tr>
          <tr>
            <td>
              <b>Webpack version:</b>
            </td>
            <td>5 (latest webpack version)</td>
          </tr>
        </table>
        <p />
        <BuyButton />
        <p>It's time for you to take back control of your webpack config!</p>
        <div style={{ clear: 'both' }} />
        <h3>Still not convinced?</h3>
        <p>
          <HiddenSampleChapterSignupForm />
          <div style={{ clear: 'both' }} />
          <br /> It can also be good to know that I offer a 30-day money-back
          guarantee if you are not happy with the book.
        </p>
        <h3>About the author</h3>
        <img alt="Jakob Lind" className={styles.authorImage} src={profileImg} />
        Hi, I'm Jakob Lind (
        <a href="https://twitter.com/karljakoblind">@karljakoblind</a>
        ). I'm a full stack developer and independent consultant. I have 10
        years of experience as a professional dev and I have been coding as a
        hobby since I was a kid.
        <br />
        <br />
        I’ve written hundreds of webpack apps - everything from small
        experimentation apps to large-scale production apps serving millions of
        users.
        <br />
        <br />
        <div style={{ clear: 'both' }} />
        <h3>FAQ</h3>
        <p>
          <b>Q: What if I don't like the book?</b>
        </p>
        <p>A: I offer a 30-day no-questions-asked money-back guarantee</p>
        <p>
          <b>Q: What version of webpack do the book use?</b>
        </p>
        <p>A: It's written for the latest version of webpack: webpack 5. </p>
        <p>
          <b>
            Q: But soon there will be a new version of webpack and this book
            will be outdated?
          </b>
        </p>
        <p>
          A: Included in the price is a lifetime of updates! Whenever I update
          the book because there is a new version of webpack or if I extend the
          book with new material, you will get the update straight in your inbox
          with no additional cost.{' '}
        </p>
        <p>
          <b>Q: What formats do I get?</b>
        </p>
        <p>
          A: You'll get PDF and EPUB. If I sometime in the future offer more
          formats, you will get them also of course.
        </p>
        <p>
          <b>Q: How many pages is it? </b>
        </p>
        <p>
          A: 100 pages. It's short and sweet so that you'll actually{' '}
          <b>read it</b>.
        </p>
      </div>
    </Layout>
  );
};
