// React
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Material UI
import { Container } from '@material-ui/core';
import { Nav } from '../components';

class App extends React.Component {
    render() {
        return (
            <Router>
                <Nav />
                <Container maxWidth='xl'>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Switch>
                            <Route exact path='/' render={() => <div></div>} />
                        </Switch>
                    </Suspense>
                </Container>
            </Router>
        );
    }
}

export default App;
