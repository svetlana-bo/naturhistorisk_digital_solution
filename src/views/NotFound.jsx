import styles from '../modules/NotFound.module.css';
import egg from '../assets/images/egg.png';

function NotFound() {
      return (
      <div className={styles.main_container}>
      <h1>404</h1>
      <h2>Something went wrong</h2>
      <img src={egg} alt="Not Found" className={styles.image} />
      </div>
    )
  }
  
  export default NotFound;