import { useEffect } from 'react'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/react'
import { useClickOutside } from 'src/lib/hooks'

const ProjectMonthCalendar = ({ children }) => {
  const [current, send] = useMachine(jumpMachine)

  useEffect(() => {
    const handler = (e) => {
      switch (e.key) {
        case 'j':
          e.preventDefault()
          e.ctrlKey
            ? send('JUMP')
            : document.querySelector(`#day${new Date().getDate()}`)?.focus()
      }
    }

    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [send])

  const handleKeyDown = (e) => {
    e.stopPropagation()
    switch (e.key) {
      case 'Enter':
        send({ type: 'LAND', day: e.target.value })
        break
      case 'Escape':
        send('CANCEL')
        break
    }
  }

  const ref = useClickOutside(() => send('CANCEL'))

  const daysOfTheWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const header = daysOfTheWeek.map((day) => {
    return (
      <div key={day} className="text-center">
        {day}
      </div>
    )
  })

  return (
    <div className="w-64 grid grid-cols-7 border border-gray-900 rounded shadow-br">
      {current.matches('jumping') ? (
        <input
          ref={ref}
          type="text"
          autoFocus={true}
          className="absolute m-1 w-8 bg-red-500 rounded focus:outline-none text-center shadow-br"
          onKeyDown={handleKeyDown}
        />
      ) : null}
      {header}
      {children}
    </div>
  )
}

export default ProjectMonthCalendar

const jumpMachine = createMachine({
  id: 'jump',
  initial: 'idle',
  states: {
    idle: {
      on: {
        JUMP: 'jumping',
      },
    },
    jumping: {
      on: {
        LAND: {
          target: 'idle',
          actions: (_, { day }) => {
            document.querySelector(`#day${day}`)?.focus()
          },
        },
        CANCEL: 'idle',
      },
    },
  },
})
