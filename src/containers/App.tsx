// React
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// AWS
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from '../aws-exports';

// Material UI
import { Container } from '@material-ui/core';

// FJ
import { Nav } from '../components';
import JournalEntries from './JournalEntries';
import '../themes/fj-amplify-theme.css';

Amplify.configure(awsconfig);

export interface AppState {
    authState: AuthState;
    user: any;
}

class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props);

        this.state = {
            authState: AuthState.SignedOut,
            user: {},
        };
    }

    componentDidMount = () => {
        onAuthUIStateChange((nextAuthState, authData) => {
            console.log(authData);
            this.setState({ authState: nextAuthState, user: authData });
        });
    };

    componentDidUpdate = () => {
        onAuthUIStateChange((nextAuthState, authData) => {
            this.setState({ authState: nextAuthState, user: authData });
        });
    };

    render() {
        return this.state.authState === AuthState.SignedIn &&
            this.state.user ? (
            <Router>
                <Nav />
                <Container maxWidth='xl'>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Switch>
                            <Route
                                exact
                                path='/'
                                render={() => (
                                    <JournalEntries
                                        userId={this.state.user?.username}
                                    />
                                )}
                            />
                        </Switch>
                    </Suspense>
                </Container>
            </Router>
        ) : (
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
            </AmplifyAuthenticator>
        );
    }
}

export default App;
