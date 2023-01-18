import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { APIProvider } from './Components/APIProvider'
import { store } from 'App/store'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <Provider store={store}>
        <APIProvider>
            <App />
        </APIProvider>
    </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
