/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect } from "react";
import { Layout, Menu, Dropdown, notification, BackTop, Modal } from "antd";
import PropTypes from "prop-types";
import { useHistory, useLocation } from "react-router";
import MediaQuery from "react-responsive";
import {
  SettingOutlined,
  HomeOutlined,
  SnippetsOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserOutlined,
  WhatsAppOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import SideBar from "../components/SideBar";
import logo from "../../logo.svg";
import { MODULE_NAME as MODULE_UI } from "../../modules/ui/models";
import { MODULE_NAME as MODULE_USER } from "../../modules/users/models";
import * as actionSagaUser from "../../modules/users/actions";
import * as actionUI from "../../modules/ui/reducers";
import Overplay from "../components/Overplay";

const breakpoint = 760;
const { Header, Content } = Layout;

function MainLayout({ children, admin }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const error = useSelector(state => state[MODULE_UI].error);
  const success = useSelector(state => state[MODULE_UI].success);
  const infor = useSelector(state => state[MODULE_UI].infor);
  const openSidebar = useSelector(state => state[MODULE_UI].openSideBar);
  const isLogin = useSelector(state => state[MODULE_USER].isLogin);
  const theme = useSelector(state => state[MODULE_UI].theme);
  const url = useLocation();
  const lang = useSelector(state => state[MODULE_UI].lang);
  const { i18n, t } = useTranslation();

  const handleSelectMenu = link => {
    if (link.key !== "/logout") history.push(link.key);
  };

  useEffect(() => {
    if (error)
      notification.error({
        message: error
      });
    setTimeout(() => {
      dispatch(actionUI.CLEAR_ERROR());
    }, 100);
  }, [error, dispatch]);

  useEffect(() => {
    if (success)
      notification.success({
        message: success
      });
    setTimeout(() => {
      dispatch(actionUI.CLEAR_SUCCESS());
    }, 100);
  }, [success, dispatch]);

  useEffect(() => {
    if (infor) {
      notification.info({
        message: infor
      });
      setTimeout(() => {
        dispatch(actionUI.CLEAR_INFO());
      }, 100);
    }
  }, [infor, dispatch]);

  const handleLogout = () => {
    const { confirm } = Modal;

    confirm({
      title: t("warning"),
      content: <p>{t("areYouSureToLogout")}</p>,
      onOk() {
        dispatch(actionSagaUser.logout());
        history.push("/");
      },
      okText: t("ok"),
      cancelText: t("cancel")
    });
  };

  const handleSelectLanguage = value => {
    dispatch(actionUI.SET_LANG(value.key));
    i18n.changeLanguage(value.key);
  };

  const handleSelectMenuMobile = value => {
    let newLang = "";
    switch (value.key) {
      case "/logout":
        return "";
      case "/change-language":
        if (lang === "vi") newLang = "en";
        else newLang = "vi";
        dispatch(actionUI.SET_LANG(newLang));
        i18n.changeLanguage(newLang);
        if (newLang === "en")
          notification.success({
            message: t("translate_to_en")
          });
        else
          notification.success({
            message: t("translate_to_vi")
          });
        return null;
      default:
        return history.push(value.key);
    }
  };

  return (
    <Layout className={`layout ${theme}`}>
      <Header
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <MediaQuery minWidth={breakpoint}>
          <Menu
            mode="horizontal"
            selectedKeys={[url.pathname]}
            style={{ lineHeight: "64px", fontWeight: "700", width: "100%" }}
            onSelect={handleSelectMenu}
          >
            <Menu.Item disabled style={{ cursor: "pointer" }}>
              <img src={logo} alt="" style={{ width: 50, height: 50 }} />
            </Menu.Item>
            <Menu.Item key="/">{t("homepage")}</Menu.Item>
            <Menu.Item key="/about-me">{t("aboutMe")}</Menu.Item>
            {admin ? <Menu.Item key="/write_blog">{t("writing")}</Menu.Item> : null}
            {isLogin === false ? (
              <Menu.Item className="login" key="/login">
                {t("login")}
              </Menu.Item>
            ) : (
              <Menu.Item
                key="/logout"
                className="login"
                style={{ float: "right" }}
                onClick={handleLogout}
              >
                {t("logout")}
              </Menu.Item>
            )}
            {/* <Menu.Item style={{ float: "right" }}>
              <UserOutlined />
            </Menu.Item> */}
            <Menu.Item disabled className="language">
              <Dropdown
                overlay={() => {
                  return (
                    <Menu onClick={handleSelectLanguage}>
                      <Menu.Item key="vi">
                        <img
                          src="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources-cdn/Images/vn.png"
                          alt=""
                          style={{ width: 20, height: 20, marginRight: 5 }}
                        />
                        Việt nam
                      </Menu.Item>
                      <Menu.Item key="en">
                        {" "}
                        <img
                          src="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources-cdn/Images/en.png"
                          alt=""
                          style={{ width: 20, height: 20, marginRight: 5 }}
                        />
                        English
                      </Menu.Item>
                    </Menu>
                  );
                }}
              >
                {lang === "vi" ? (
                  <img
                    src="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources-cdn/Images/vn.png"
                    alt=""
                    style={{ width: 30, height: 30 }}
                  />
                ) : (
                  <img
                    src="https://codelearnstorage.s3.amazonaws.com/Themes/TheCodeCampPro/Resources-cdn/Images/en.png"
                    alt=""
                    style={{ width: 20, height: 20, marginRight: 5 }}
                  />
                )}
              </Dropdown>
            </Menu.Item>
          </Menu>
        </MediaQuery>
        <MediaQuery maxWidth={breakpoint}>
          <SideBar admin={admin} openSidebar={openSidebar} />
          <Menu
            className="small-menu"
            theme="dark"
            mode="horizontal"
            selectedKeys={[url.pathname]}
            style={{ lineHeight: "64px", fontWeight: "700", width: "100%" }}
            onSelect={handleSelectMenuMobile}
          >
            <Menu.Item key="/">
              <HomeOutlined />
            </Menu.Item>

            {admin ? (
              <Menu.Item key="/write_blog">
                <SnippetsOutlined />
              </Menu.Item>
            ) : null}

            {isLogin ? (
              <Menu.Item key="profile">
                <UserOutlined />
              </Menu.Item>
            ) : null}

            <Menu.Item key="/about-me">
              <WhatsAppOutlined />
            </Menu.Item>

            <Menu.Item key="/change-language">
              <SyncOutlined />
            </Menu.Item>

            {!isLogin ? (
              <Menu.Item key="/login">
                <LoginOutlined />
              </Menu.Item>
            ) : (
              <Menu.Item key="/logout" onClick={handleLogout}>
                <LogoutOutlined />
              </Menu.Item>
            )}
          </Menu>
        </MediaQuery>
      </Header>
      <Content style={{ backgroundColor: "#fff" }}>
        <div className="site-layout-content">{children}</div>
      </Content>
      <Overplay openSidebar={openSidebar} />
      <div
        onClick={() =>
          theme === "light"
            ? dispatch(actionUI.CHANGE_THEME("dark"))
            : dispatch(actionUI.CHANGE_THEME("light"))
        }
        className="affix"
      >
        <SettingOutlined />
      </div>
      <BackTop />
    </Layout>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
  admin: PropTypes.bool
};

MainLayout.defaultProps = {
  children: null,
  admin: false
};

export default MainLayout;
