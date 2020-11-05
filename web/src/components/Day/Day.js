import { useDayMachine } from './Day.hooks'
import { isToday } from 'src/lib/date'

const Day = ({ project, date, hasEntry }) => {
  const [state, send] = useDayMachine({ project, date, hasEntry })

  const handleKeyDown = (e) => {
    switch (e.key) {
      /**
       * Navigation
       */
      case 'h':
        e.target.previousElementSibling?.focus()
        break
      case 'l':
        e.target.nextElementSibling?.focus()
        break
      case 'j':
        if (!e.ctrlKey) {
          e.stopPropagation()
          document.querySelector(`#day${date.getDate() + 7}`)?.focus()
        }
        break
      case 'k':
        document.querySelector(`#day${date.getDate() - 7}`)?.focus()
        break
      case 'Escape':
        e.target.blur()
        break
      /**
       * "Logic"
       */
      case 't':
        send('TOGGLE')
        break
    }
  }

  return (
    <div
      id={`day${state.context.date.getDate()}`}
      className="flex flex-col relative"
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <div
        className={
          'text-center ' + (isToday(state.context.date) ? 'underline' : '')
        }
      >
        {state.context.date.getDate()}
      </div>
      <div
        className={
          'text-center ' +
          (state.context.hasEntry ? 'bg-red-500 shadow-kp' : 'bg-gray-200')
        }
      >
        &nbsp;
      </div>
    </div>
  )
}

export default Day
