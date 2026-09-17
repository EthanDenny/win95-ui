import { NumberInput } from './components/NumberInput'
import { Spinner } from './components/Spinner'
import { Checkbox, Radio } from './components/Choice'
import { TextInput } from './components/TextInput'
import { PixelScale } from './components/PixelScale'
import { Button } from './components/Button'
import { Dropdown } from './components/Dropdown'
import { useId, useState } from 'react'
import { Demo, Toggle } from './InteractiveDemo'

export function ButtonDemo({ scale }: { scale: number }) {
  const [disabled, setDisabled] = useState(false)
  const [preferred, setPreferred] = useState(false)
  const [clicks, setClicks] = useState(0)
  return <Demo title="Button" controls={<><Toggle title="Button" label="Disabled" value={disabled} onChange={setDisabled} /><Toggle title="Button" label="Default button" value={preferred} onChange={setPreferred} /><span aria-live="polite">{clicks} {clicks === 1 ? 'click' : 'clicks'}</span></>}>
    <PixelScale scale={scale} width={75} height={23}><Button aria-label="Try button" disabled={disabled} defaultButton={preferred} onClick={() => setClicks(value => value + 1)}>Button</Button></PixelScale>
  </Demo>
}

export function ChoiceDemo({ scale, radio = false }: { scale: number; radio?: boolean }) {
  const title = radio ? 'Radio group' : 'Checkbox'
  const name = useId()
  const [disabled, setDisabled] = useState(false)
  const [selected, setSelected] = useState(0)
  const [checked, setChecked] = useState(false)
  const labels = radio ? ['First option', 'Second option'] : ['Enable sound']
  const Control = radio ? Radio : Checkbox
  return <Demo title={title} controls={<Toggle title={title} label="Disabled" value={disabled} onChange={setDisabled} />}>
    <PixelScale scale={scale} width={130} height={radio ? 52 : 30}>
      <div className="choice-demo-layout" style={{ height: radio ? 52 : 30 }}>
        {labels.map((label, index) => <Control key={label} name={name} disabled={disabled} checked={radio ? selected === index : checked} onChange={event => radio ? setSelected(index) : setChecked(event.target.checked)}>{label}</Control>)}
      </div>
    </PixelScale>
  </Demo>
}

export function TextDemo({ scale, numeric = false }: { scale: number; numeric?: boolean }) {
  const title = numeric ? 'Number input' : 'Text field'
  const [disabled, setDisabled] = useState(false)
  const [readOnly, setReadOnly] = useState(false)
  const [value, setValue] = useState(numeric ? '10' : 'Windows 95')
  const fieldWidth = numeric ? 100 : 180
  return <Demo title={title} controls={<><Toggle title={title} label="Disabled" value={disabled} onChange={setDisabled} /><Toggle title={title} label="Read only" value={readOnly} onChange={setReadOnly} /></>}>
    <PixelScale scale={scale} width={fieldWidth} height={22}>
      {numeric ? <NumberInput aria-label={title} width={fieldWidth} disabled={disabled} readOnly={readOnly} value={value} onChange={setValue} />
        : <TextInput width={fieldWidth} aria-label={title} disabled={disabled} readOnly={readOnly} value={value} onChange={event => setValue(event.target.value)} />}
    </PixelScale>
  </Demo>
}

export function DropdownDemo({ scale, arrowOnly = false }: { scale: number; arrowOnly?: boolean }) {
  const title = arrowOnly ? 'Dropdown button' : 'Dropdown field'
  const [disabled, setDisabled] = useState(false)
  const [selected, setSelected] = useState(0)
  const options = ['Documents', 'Programs', 'Settings']
  return <Demo title={title} controls={<><Toggle title={title} label="Disabled" value={disabled} onChange={setDisabled} />{arrowOnly && <span>{options[selected]}</span>}</>}>
    <PixelScale scale={scale} width={160} height={78}>
      <Dropdown label={title} options={options} value={selected} onChange={setSelected} disabled={disabled} arrowOnly={arrowOnly} />
    </PixelScale>
  </Demo>
}

export function SpinnerDemo({ scale }: { scale: number }) {
  const [upDisabled, setUpDisabled] = useState(false)
  const [downDisabled, setDownDisabled] = useState(false)
  const [value, setValue] = useState(0)
  return <Demo title="Spinner" controls={<><Toggle title="Spinner" label="Disable up" value={upDisabled} onChange={setUpDisabled} /><Toggle title="Spinner" label="Disable down" value={downDisabled} onChange={setDownDisabled} /><span aria-live="polite">Value: {value}</span></>}>
    <PixelScale scale={scale} width={16} height={20}><Spinner upDisabled={upDisabled} downDisabled={downDisabled} onStep={direction => setValue(value => value + direction)} /></PixelScale>
  </Demo>
}
