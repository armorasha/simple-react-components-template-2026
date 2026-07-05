import React, { useState } from 'react';
import Links from './Components/Links';
import Button from './Components/Button';
import TextInput from './Components/TextInput';
import Select from './Components/Select';
import Checkbox from './Components/Checkbox';
import Radio from './Components/Radio';
import Toggle from './Components/Toggle';
import Badge from './Components/Badge';
import StatusLight from './Components/StatusLight';
import Gauge from './Components/Gauge';
import MetricTile from './Components/MetricTile';
import Sparkline from './Components/Sparkline';
import AlarmPanel from './Components/AlarmPanel';
import EStopButton from './Components/EStopButton';
import SquareButton from './Components/SquareButton';
import Card from './Components/Card';
import Tabs from './Components/Tabs';
import Alert from './Components/Alert';
import Tooltip from './Components/Tooltip';
import ProgressBar from './Components/ProgressBar';
import Spinner from './Components/Spinner';
import Modal from './Components/Modal';
import Slider from './Components/Slider';
import Accordion from './Components/Accordion';
import Table from './Components/Table';
import Breadcrumb from './Components/Breadcrumb';
import Pagination from './Components/Pagination';
import { Heading1, Heading2, Body, Muted } from './Components/Typography';
import DeckLineLayerMap from './Components/DeckLineLayerMap';
import Select2 from './Components/Select2';
import DefaultLayout from './Layouts/DefaultLayout';

export default function App() {
  const [toggleOn, setToggleOn] = useState(true);
  const [topPrimarySelected, setTopPrimarySelected] = useState(true);
  const [topSecondarySelected, setTopSecondarySelected] = useState(true);
  const [topDangerSelected, setTopDangerSelected] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(40);

  return (
    <DefaultLayout>
      <header className="flex items-start justify-between gap-4">
        <div>
          <Heading1>Component Style Guide</Heading1>
          <Muted>Core building blocks for the Interface Terminal frontend</Muted>
        </div>
        <Links to="/login" chevron="right" className="whitespace-nowrap mt-2">
          Login page
        </Links>
      </header>

      <Card title="Buttons">
        <div className="flex gap-3 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
        </div>

        <Muted>
          <span className="mt-6 block text-xs uppercase tracking-wide">Click to toggle</span>
        </Muted>
        <div className="flex gap-3 flex-wrap mt-2">
          <Button
            variant="primary"
            selected={topPrimarySelected}
            onClick={() => setTopPrimarySelected((v) => !v)}
          >
            Primary
          </Button>
          <Button
            variant="secondary"
            selected={topSecondarySelected}
            onClick={() => setTopSecondarySelected((v) => !v)}
          >
            Secondary
          </Button>
          <Button variant="danger" selected={topDangerSelected} onClick={() => setTopDangerSelected((v) => !v)}>
            Danger
          </Button>
        </div>

        <Muted>
          <span className="mt-6 block text-xs uppercase tracking-wide">Disabled</span>
        </Muted>
        <div className="flex gap-2 flex-wrap mt-2">
          <Button variant="primary" size="sm" disabled>
            Disabled
          </Button>
          <Button variant="secondary" size="sm" disabled>
            Disabled
          </Button>
          <Button variant="danger" size="sm" disabled>
            Disabled
          </Button>
        </div>
      </Card>

      <Card title="Form controls">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput label="Text input" placeholder="Enter value" />
          <Select
            label="Select"
            options={[
              { value: 'a', label: 'Option A' },
              { value: 'b', label: 'Option B' },
              { value: 'c', label: 'Option C' },
            ]}
          />
          <div className="flex flex-col gap-2">
            <Checkbox label="Checkbox option" defaultChecked />
            <Checkbox label="Disabled checkbox" disabled />
          </div>
          <div className="flex flex-col gap-2">
            <Radio name="radio-group" label="Radio option 1" defaultChecked />
            <Radio name="radio-group" label="Radio option 2" />
          </div>
          <Toggle label="Toggle switch" checked={toggleOn} onChange={setToggleOn} />
        </div>
      </Card>

      <Card title="Dropdown (custom listbox)" className="relative z-20">
        <div className="max-w-xs">
          <Select2
            label="Node"
            required
            placeholder="Select a node"
            items={[
              { id: 1, val: 'Relay A' },
              { id: 2, val: 'Relay B' },
              { id: 3, val: 'Relay C' },
            ]}
          />
        </div>
      </Card>

      <Card title="Status badges">
        <div className="flex gap-3 flex-wrap">
          <Badge status="info">Info</Badge>
          <Badge status="warning">Warning</Badge>
          <Badge status="critical">Critical</Badge>
          <Badge status="success">Success</Badge>
          <Badge status="neutral">Neutral</Badge>
        </div>
      </Card>

      <Card title="Status lights">
        <div className="flex gap-6 flex-wrap">
          <StatusLight status="info">Info</StatusLight>
          <StatusLight status="warning">Warning</StatusLight>
          <StatusLight status="critical">Critical</StatusLight>
          <StatusLight status="success">Online</StatusLight>
          <StatusLight status="neutral">Neutral</StatusLight>
        </div>

        <Muted>
          <span className="mt-6 block text-xs uppercase tracking-wide">No label</span>
        </Muted>
        <div className="flex gap-4 flex-wrap mt-2">
          <StatusLight status="info" />
          <StatusLight status="warning" />
          <StatusLight status="critical" />
          <StatusLight status="success" />
          <StatusLight status="neutral" />
        </div>

        <Muted>
          <span className="mt-6 block text-xs uppercase tracking-wide">Small</span>
        </Muted>
        <div className="flex gap-6 flex-wrap mt-2">
          <StatusLight status="info" size="sm">Info</StatusLight>
          <StatusLight status="warning" size="sm">Warning</StatusLight>
          <StatusLight status="critical" size="sm">Critical</StatusLight>
          <StatusLight status="success" size="sm">Online</StatusLight>
          <StatusLight status="neutral" size="sm">Neutral</StatusLight>
        </div>
      </Card>

      <Card title="Gauges">
        <div className="flex gap-8 flex-wrap">
          <Gauge label="Pressure" value={42} unit="psi" status="info" />
          <Gauge label="Temperature" value={78} unit="°C" status="warning" />
          <Gauge label="Flow rate" value={95} unit="%" status="critical" />
        </div>
      </Card>

      <Card title="Metric tiles">
        <div className="flex gap-4 flex-wrap">
          <MetricTile label="RPM" value="1,842" status="info" delta="12" deltaDirection="up" />
          <MetricTile label="Vibration" value="0.34" unit="mm/s" status="success" delta="0.02" deltaDirection="down" />
          <MetricTile label="Bearing temp" value="86" unit="°C" status="warning" delta="3" deltaDirection="up" />
          <MetricTile label="Uptime" value="99.2" unit="%" status="neutral" delta="0" deltaDirection="flat" />
        </div>
      </Card>

      <Card title="Trend sparklines">
        <div className="flex gap-8 flex-wrap">
          <Sparkline label="Line pressure" status="info" data={[12, 14, 13, 16, 15, 18, 17, 19, 18, 21]} />
          <Sparkline label="Motor temp" status="warning" data={[60, 62, 61, 65, 68, 70, 74, 78, 76, 79]} />
          <Sparkline label="Fault count" status="critical" data={[0, 0, 1, 0, 2, 1, 3, 2, 4, 5]} />
        </div>
      </Card>

      <Card title="Alarm panel">
        <AlarmPanel
          alarms={[
            { id: 1, severity: 'critical', message: 'Relay node 7 link loss', time: '04:12:33 UTC' },
            { id: 2, severity: 'warning', message: 'Sensor array 3 latency above threshold', time: '04:10:02 UTC' },
            { id: 3, severity: 'info', message: 'Firmware update available for node 2', time: '03:58:47 UTC' },
          ]}
        />
      </Card>

      <Card title="Emergency stop">
        <div className="flex gap-8 flex-wrap items-start">
          <EStopButton />
        </div>
      </Card>

      <Card title="Square buttons">
        <div className="flex gap-6 flex-wrap">
          <SquareButton variant="success" defaultSelected>
            Start
          </SquareButton>
          <SquareButton variant="danger" defaultSelected>
            Stop
          </SquareButton>
          <SquareButton variant="secondary" defaultSelected>
            Pause
          </SquareButton>
          <SquareButton variant="primary" defaultSelected>
            Reset
          </SquareButton>
          <SquareButton variant="primary" disabled>
            Disabled
          </SquareButton>
        </div>
      </Card>

      <Card title="Typography">
        <div className="space-y-2">
          <Heading1>Heading 1</Heading1>
          <Heading2>Heading 2</Heading2>
          <Body>Body text used for standard content and descriptions.</Body>
          <Muted>Muted text used for secondary/help content.</Muted>
        </div>
      </Card>

      <Card title="Tabs">
        <Tabs
          tabs={[
            { label: 'Overview', content: <Body>Overview panel content.</Body> },
            { label: 'Details', content: <Body>Details panel content.</Body> },
            { label: 'Settings', content: <Body>Settings panel content.</Body> },
          ]}
        />
      </Card>

      <Card title="Map — LineLayer (deck.gl)">
        <DeckLineLayerMap />
      </Card>

      <Card title="Alerts">
        <div className="flex flex-col gap-3">
          <Alert variant="info" title="Info">
            System nominal, all subsystems reporting.
          </Alert>
          <Alert variant="warning" title="Warning">
            Sensor array 3 latency above threshold.
          </Alert>
          <Alert variant="critical" title="Critical">
            Link loss on relay node 7.
          </Alert>
          <Alert variant="success" title="Success">
            Calibration completed successfully.
          </Alert>
        </div>
      </Card>

      <Card title="Modal">
        <div className="flex gap-3 flex-wrap">
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Open modal
          </Button>
          <Button variant="secondary" onClick={() => setInfoModalOpen(true)}>
            Open info modal
          </Button>
          <Button variant="danger" onClick={() => setDangerModalOpen(true)}>
            Open danger modal
          </Button>
        </div>
        <Modal
          open={modalOpen}
          title="Confirm action"
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          This will restart the affected subsystem. Continue?
        </Modal>
        <Modal open={infoModalOpen} title="Firmware up to date" onClose={() => setInfoModalOpen(false)} />
        <Modal
          open={dangerModalOpen}
          title="Delete node record"
          onClose={() => setDangerModalOpen(false)}
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setDangerModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => setDangerModalOpen(false)}>
                Delete
              </Button>
            </>
          }
        >
          This will permanently remove the node record. This action cannot be undone.
        </Modal>
      </Card>

      <Card title="Tooltip">
        <Tooltip label="Additional context shown on hover">
          <Button variant="secondary" size="sm">
            Hover me
          </Button>
        </Tooltip>
      </Card>

      <Card title="Progress & loading">
        <div className="flex flex-col gap-6">
          <ProgressBar value={62} label="Sync progress" />
          <div className="flex items-center gap-6">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </div>
      </Card>

      <Card title="Slider">
        <Slider label="Threshold" min={0} max={100} value={sliderValue} onChange={setSliderValue} />
      </Card>

      <Card title="Accordion">
        <Accordion
          items={[
            {
              title: 'Diagnostics',
              content: (
                <ul className="list-disc pl-4 space-y-1">
                  <li>All diagnostic checks passed at 04:12 UTC.</li>
                  <li>14 of 14 sensor nodes reporting, no faults detected.</li>
                  <li>Firmware v3.2.1 running on all nodes, no updates pending.</li>
                </ul>
              ),
            },
            {
              title: 'Maintenance',
              content: (
                <ul className="list-disc pl-4 space-y-1">
                  <li>Last maintenance performed 3 days ago.</li>
                  <li>Uplink stable, 12ms average latency.</li>
                  <li>Main and backup power rails nominal, 98% capacity.</li>
                </ul>
              ),
            },
            {
              title: 'Security',
              content: (
                <ul className="list-disc pl-4 space-y-1">
                  <li>No unauthorized access attempts in the last 24 hours.</li>
                  <li>All access credentials rotated within policy window.</li>
                </ul>
              ),
            },
          ]}
        />
      </Card>

      <Card title="Table">
        <Table
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Node' },
            { key: 'status', label: 'Status' },
          ]}
          rows={[
            { id: '001', name: 'Relay A', status: <Badge status="success">Online</Badge> },
            { id: '002', name: 'Relay B', status: <Badge status="success">Online</Badge> },
            { id: '003', name: 'Relay C', status: <Badge status="warning">Degraded</Badge> },
          ]}
        />
      </Card>

      <Card title="Breadcrumb & pagination">
        <div className="flex flex-col gap-4">
          <Breadcrumb items={['Home', 'Operations', 'Relay nodes']} />
          <Pagination pageCount={5} />
        </div>
      </Card>
    </DefaultLayout>
  );
}
