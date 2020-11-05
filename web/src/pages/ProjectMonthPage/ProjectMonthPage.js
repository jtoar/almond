import { useState } from 'react'

import ProjectMonthNav from 'src/components/ProjectMonthNav'
import ProjectMonthCalendar from 'src/components/ProjectMonthCalendar'
import DaysCell from 'src/components/DaysCell'

import { toMonthIndex } from 'src/lib/date'

const ProjectMonthPage = ({ project, month }) => {
  const [notes, setNotes] = useState(null)

  const startsOn = new Date(2020, toMonthIndex(month)).getDay()
  const filler = [...Array(startsOn).keys()].map((el) => {
    return <div key={el}>&nbsp;</div>
  })

  return (
    // Page
    <div className="p-4">
      <div className="space-y-4">
        <ProjectMonthNav {...{ project, month }} />
        <div className="flex flex-row space-x-4">
          <ProjectMonthCalendar>
            {filler}
            <DaysCell {...{ project, month, setNotes }} />
          </ProjectMonthCalendar>
          {notes}
        </div>
      </div>
    </div>
  )
}

export default ProjectMonthPage
