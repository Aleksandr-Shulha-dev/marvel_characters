import './ErrorMessage.scss'
import img from './error.gif'

const ErrorMessage = () => {
  return (
    <img className="error-img" src={img} alt="Error" />
  )
}

export default ErrorMessage