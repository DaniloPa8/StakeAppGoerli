import classes from "./../styles/Sidebar.module.css";

import menu from "./../images/menu.svg";
import token from "./../images/token.svg";
import manual from "./../images/book.svg";
import info from "./../images/info.svg";
import logout from "./../images/logout.svg";
import owner from "./../images/owner.svg";

const Sidebar = (props) => {
  return (
    <>
      <div
        className={
          props.menuOpen
            ? classes.sidebar_menu_cont_open
            : classes.sidebar_menu_cont
        }
      >
        <img
          src={menu}
          className={classes.sidebar_menu}
          onClick={props.menuHandler}
        />
        <p className={classes.menu_txt}> Menu </p>
      </div>
      <div
        className={`${classes.sidebar} ${classes.animate_fade} ${
          props.menuOpen ? classes.menu_open_mobile : ""
        }`}
      >
        {props.menuOpen && (
          <div
            className={classes.sidebar_menu_close}
            onClick={props.menuHandler}
          >
            <p>Close Menu</p>
          </div>
        )}
        <div className={classes.sidebar_comp}>
          <p>StakeAppⒸ</p>
        </div>
        <div
          className={classes.sidebar_token}
          onClick={props.isOwner ? props.ownerHandler : props.tokenHandler}
        >
          {props.isOwner && (
            <img src={owner} className={classes.sidebar_token_img} />
          )}
          {!props.isOwner && (
            <img src={token} className={classes.sidebar_token_img} />
          )}
        </div>
        <div className={classes.sidebar_manual} onClick={props.manualHandler}>
          <img src={manual} className={classes.sidebar_manual_img} />
        </div>
        <div className={classes.sidebar_aboutUs} onClick={props.aboutHandler}>
          <img src={info} className={classes.sidebar_info_img} />
        </div>
        <div className={classes.sidebar_logout}>
          <img
            src={logout}
            className={classes.sidebar_logout_img}
            onClick={() => window.location.reload(false)}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
