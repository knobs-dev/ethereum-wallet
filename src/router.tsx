import { Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// Import pages
import GuideScreen from './pages/guideScreen/guideScreen';
import NotFound from './pages/404/404';
import WalletCreation from './pages/walletCreation/walletCreation';
import MnemonicVerification from './pages/mnemonicVerification/mnemonicVerification';
import Wallet from './pages/wallet/wallet';
import Faucet from './pages/faucet/faucet';
import PrivacySettings from './pages/privacySettings/privacySettings';
import SendTransaction from './pages/sendTransaction/sendTransaction';
import Transaction from './pages/transaction/transaction';
import TransactionDetail from './pages/transactionDetail/transactionDetail';
import AnimationCredits from './pages/animationCredits/animationCredits';
import Notarize from './pages/notarize/notarize';

// import TransactionList from './components/transactionList/transactionList';

type CustomRouterProps = {};

const CustomRouter = (props: CustomRouterProps) => {
    return (
        <Switch>
            <Route exact path='/' component={GuideScreen} />
            <Route exact path='/wallet/create' component={WalletCreation} />
            <Route
                exact
                path='/wallet/verify'
                component={MnemonicVerification}
            />
            <Route exact path='/wallet' component={Wallet} />
            <Route exact path='/faucet' component={Faucet} />
            <Route exact path='/privacy' component={PrivacySettings} />
            <Route exact path='/tx' component={Transaction} />
            <Route exact path='/tx/:hash' component={TransactionDetail} />
            <Route
                exact
                path='/wallet/send/:address?'
                component={SendTransaction}
            />
            <Route exact path='/credits' component={AnimationCredits} />
            <Route exact path='/wallet/notarize' component={Notarize} />
            {/* Fallback */}
            <Route path='*' component={NotFound} />
        </Switch>
    );
};

// Browser history
export const customHistory = createBrowserHistory();

export default CustomRouter;
