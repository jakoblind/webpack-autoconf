import React, { useState, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Modal from './Modal';
import * as styles from '../styles.module.css';
import Image from 'next/image';

import { CourseSignupForm } from './SignupForms';

import zipImg from '../../images/zip.svg';

export function DownloadButton({ url, onClick, filename, buildTool }) {
  const [modalOpen, setModalOpen] = useState(false);
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <div>
      <button
        className={styles.btn}
        onClick={() => {
          onClick();
          if (buildTool === 'webpack') {
            setModalOpen(true);
          }
        }}
        id="download"
      >
        <div className={styles.icon}>
          <Image alt="zip file" src={zipImg} width="20" height="20" />
        </div>
        <span>Download project</span>
      </button>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 style={{ width: '90%', float: 'left' }}>Downloading...</h2>
        <button
          style={{ borderRadius: '100px', float: 'left' }}
          onClick={() => setModalOpen(false)}
        >
          X
        </button>
        <br />
        <br />
        <p>Enjoy your newly created {buildTool} project!</p>

        <h3>Learn webpack with my free email course</h3>
        <div>
          <p>You get 5 emails in 5 days.</p>
          <ul>
            <li>Lesson 1: What does webpack do? (an overview)</li>
            <li>Lesson 2: Create your first webpack project</li>
            <li>Lesson 3: The webpack.config.js and Babel</li>
            <li>Lesson 4: Create a React app with webpack</li>
            <li>Lesson 5: Styling with webpack</li>
          </ul>
        </div>
        <p>Level up your frontend skills and create awesome apps</p>
        <CourseSignupForm tags={917914} />
      </Modal>
    </div>
  );
}

DownloadButton.propTypes = {
  url: PropTypes.string,
  filename: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  buildTool: PropTypes.string.isRequired,
};

DownloadButton.defaultProps = {
  url: '',
};
