// React
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// AWS
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import awsconfig from '../aws-exports';

// Material UI
import { Container } from '@material-ui/core';

// FJ
import { Nav } from '../components';
import JournalEntries from './JournalEntries';
import '../themes/fj-amplify-theme.css';

Amplify.configure(awsconfig);

class App extends React.Component {
    render() {
        return (
            <AmplifyAuthenticator>
                <AmplifySignUp
                    slot='sign-up'
                    formFields={[
                        {
                            type: 'username',
                            label: 'Email',
                            required: true,
                        },
                        {
                            type: 'password',
                            required: true,
                        },
                    ]}></AmplifySignUp>
                <Router>
                    <Nav />
                    <Container maxWidth='xl'>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Switch>
                                <Route
                                    exact
                                    path='/'
                                    render={() => <JournalEntries />}
                                />
                            </Switch>
                        </Suspense>
                    </Container>
                </Router>
            </AmplifyAuthenticator>
        );
    }
}

export default App;
