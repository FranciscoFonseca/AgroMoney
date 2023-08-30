// CookieValidator.js
import React from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

const withCookieValidation = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      // Check if the cookie exists or not
      const hasCookie = !!Cookies.get('your_cookie_name'); // Replace 'your_cookie_name' with your actual cookie name

      // If the cookie exists, render the wrapped component
      if (hasCookie) {
        return <WrappedComponent {...this.props} />;
      }

      // If the cookie does not exist, redirect to a login or unauthorized page
      // You can replace '/login' with any path that suits your application
      return <Redirect to="/login" />;
    }
  };
};

export default withCookieValidation;
