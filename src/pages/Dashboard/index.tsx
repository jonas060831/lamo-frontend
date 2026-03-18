
import Llama3 from '../../ai/llama3/Llama3Chat'
import AuthenticatedOptions from '../../shared/widgets/AuthenticatedOptions'

import styles from './index.module.css'

const DashboardPage = () => {
  return (
    <Llama3
     containerClass={styles.container}
     messageDisplayClass={styles.messageDisplayContainer}
     chatInputClass={styles.chatInputContainer}
     heroNotice={<AuthenticatedOptions />}
    />
  )
}

export default DashboardPage