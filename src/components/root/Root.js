import {  Outlet, NavLink } from "react-router-dom";
import styles from "../../resources/css/Root.module.css";

export const ROUTES = {
    CONTACTS: "/contacts",
    APPOINTMENTS: "/appointments",
  };

function Root() {
    return (
        <>
            <div className={styles.flex_body}>
                <nav className={styles.nav_bar}>
                    <NavLink to={ROUTES.CONTACTS} className={styles.nav_link} >
                        Contacts
                    </NavLink>
                    <NavLink to={ROUTES.APPOINTMENTS} className={styles.nav_link} >
                        Appointments
                    </NavLink>
                </nav>
                <NavLink to={ROUTES.CONTACTS}
                  className={styles.home_btn_parent}>
                    <h1 className={styles.home_btn}>Time-Wise</h1>
                </NavLink>
            </div>
            <Outlet/>
        </>
    );

}

export default Root;