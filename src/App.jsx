import React, { useState } from 'react';
import Button from './components/Button';
import TextInput from './components/TextInput';
import Select from './components/Select';
import Checkbox from './components/Checkbox';
import Radio from './components/Radio';
import Toggle from './components/Toggle';
import Badge from './components/Badge';
import Card from './components/Card';
import Tabs from './components/Tabs';
import Alert from './components/Alert';
import Tooltip from './components/Tooltip';
import ProgressBar from './components/ProgressBar';
import Spinner from './components/Spinner';
import Modal from './components/Modal';
import Slider from './components/Slider';
import Accordion from './components/Accordion';
import Table from './components/Table';
import Breadcrumb from './components/Breadcrumb';
import Pagination from './components/Pagination';
import { Heading1, Heading2, Body, Muted } from './components/Typography';
import DeckLineLayerMap from './components/DeckLineLayerMap';

export default function App() {
  const [toggleOn, setToggleOn] = useState(true);
  const [topPrimarySelected, setTopPrimarySelected] = useState(false);
  const [topSecondarySelected, setTopSecondarySelected] = useState(false);
  const [topDangerSelected, setTopDangerSelected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(40);

  return (
    <div className="min-h-screen bg-pptx-charcoal bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,80,140,0.15),transparent)] px-8 py-10 space-y-10 max-w-5xl mx-auto">
      <header>
        <Heading1>Component Style Guide</Heading1>
        <Muted>Core building blocks for the OIT (Operator Interface Terminal) frontend</Muted>
      </header>

      <Card title="Buttons">
        <Muted>Click to toggle</Muted>
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

      <Card title="Status badges">
        <div className="flex gap-3 flex-wrap">
          <Badge status="info">Info</Badge>
          <Badge status="warning">Warning</Badge>
          <Badge status="critical">Critical</Badge>
          <Badge status="success">Success</Badge>
          <Badge status="neutral">Neutral</Badge>
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
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Open modal
        </Button>
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
    </div>
  );
}
