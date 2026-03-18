import Llama3PureText from '../../ai/llama3/Llama3PureText'
import { Dock } from '../../shared/uis/navigational/Dock/Dock'

import styles from './index.module.css'

const PureTextPage = () => {

  return (
    <>
      <Llama3PureText
        containerClass={styles.container}
        topContainerClass={styles.topContainer}
        formContainerClass={styles.formContainer}
        widgetContainerClass={styles.widgetContainer}
        bottomContainerClass={styles.bottomContainer}
        >
          {/* other actions to modify result */}
      </Llama3PureText>
      
    </>
  )
}

export default PureTextPage