import {useContext} from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

//If the user is logged in, wel use this to check if they should be on login or register pages
//If theyre logged in, we redirect them to the homepage if they try and access those pages

export default function AuthRoute({component: Component, ...rest}){
    const { user } = useContext(AuthContext);

    return (
        <Route {...rest} render={props => user ? <Redirect to ='/' /> : <Component {...props} />} />
    )
}

