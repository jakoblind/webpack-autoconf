import * as styles from '../styles.module.css';
import webpackImg from '../../images/webpack-logo.png';
import webpackImgColor from '../../images/webpack-logo-color.png';
import parcelImg from '../../images/parcel-logo.png';
import parcelImgColor from '../../images/parcel-logo-color.png';
import snowpackImg from '../../images/snowpack-logo.png';
import snowpackImgColor from '../../images/snowpack-logo-color.png';
import Image from 'next/image';
import PropTypes from 'prop-types';
import _ from 'lodash';

export function Tabs({ selected, setSelected }) {
  return (
    <div className={styles.tabsContainer} id="tabs">
      <nav className={styles.tabs}>
        <button
          onClick={() => setSelected('webpack')}
          className={[
            selected === 'webpack' ? styles.selectedTab : null,
            styles.tab,
          ].join(' ')}
        >
          <div className={styles.tabImage}>
            <Image
              alt="webpack logo"
              src={selected === 'webpack' ? webpackImgColor : webpackImg}
              width={40}
              height={40}
            />
          </div>
          <div className={styles.tabsDescription}>webpack</div>
        </button>
        <button
          onClick={() => setSelected('parcel')}
          className={[
            selected === 'parcel' ? styles.selectedTab : null,
            styles.tab,
          ].join(' ')}
        >
          <div className={styles.tabImage} style={{ marginTop: '0px' }}>
            <Image
              alt="parcel logo"
              src={selected === 'parcel' ? parcelImgColor : parcelImg}
              width={35}
              height={35}
            />
          </div>
          <div className={styles.tabsDescription}>Parcel</div>
        </button>

        <button
          onClick={() => setSelected('snowpack')}
          className={[
            selected === 'snowpack' ? styles.selectedTab : null,
            styles.tab,
          ].join(' ')}
        >
          <div className={styles.tabWrapper}>
            <div className={styles.tabImage}>
              <Image
                alt="snowpack logo"
                src={selected === 'snowpack' ? snowpackImgColor : snowpackImg}
                width={22}
                height={22}
              />
            </div>
            <div
              className={styles.tabsDescription}
              style={{ marginTop: '4px' }}
            >
              Snowpack
            </div>
          </div>
        </button>
      </nav>
    </div>
  );
}

Tabs.propTypes = {
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
};
