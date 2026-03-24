import { Navigate, useNavigate } from "react-router"
import LinkButton from "../../shared/uis/Buttons/LinkButton/LinkButton"
import { useEffect, useState } from "react"


const NotFoundPage = () => {

  const navigate = useNavigate()
  const [ redirectCountdown, setRedirectCountdown ] = useState(10)

  useEffect(() => {

    const interval = setInterval(() => {
      setRedirectCountdown(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [redirectCountdown])

  if(redirectCountdown <= 0) return <Navigate to="/" />

  return (
    <div
     style={{
        width: '100vw',
        height: '80vh',
        color: 'var(--font-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
     }}
    >
        <h3>Page Not Found</h3>
        <br />
        <LinkButton title="Go Home" iconName="arrowRight" handleClick={() => navigate('/')}/>

        <h4>Redirecting in: {redirectCountdown}</h4>

    </div>
  )
}

export default NotFoundPage