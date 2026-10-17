import { useEffect, useState } from "react";
import Accordion from "./Components/Accordion";
import AlarmPanel from "./Components/AlarmPanel";
import Alert from "./Components/Alert";
import BackendStatus from "./Components/BackendStatus";
import Badge from "./Components/Badge";
import Breadcrumb from "./Components/Breadcrumb";
import Button from "./Components/Button";
import Card from "./Components/Card";
import Checkbox from "./Components/Checkbox";
import EStopButton from "./Components/EStopButton";
import Gauge from "./Components/Gauge";
import Links from "./Components/Links";
import MetricTile from "./Components/MetricTile";
import Modal from "./Components/Modal";
import Pagination from "./Components/Pagination";
import ProgressBar from "./Components/ProgressBar";
import Radio from "./Components/Radio";
import Select from "./Components/Select";
import Select2 from "./Components/Select2";
import Slider from "./Components/Slider";
import Sparkline from "./Components/Sparkline";
import Spinner from "./Components/Spinner";
import SquareButton from "./Components/SquareButton";
import StatusLight from "./Components/StatusLight";
import Table from "./Components/Table";
import Tabs from "./Components/Tabs";
import TextInput from "./Components/TextInput";
import Toggle from "./Components/Toggle";
import Tooltip from "./Components/Tooltip";
import { Body, Heading1, Heading2, Muted } from "./Components/Typography";
import DeckLineLayerMap from "./Components/deckgl/DeckLineLayerMap";
import DeckLineLayerMapAdv from "./Components/deckgl/DeckLineLayerMapAdv";
import {
  FULL_STRIDE1_CONFIG_URL,
  FULL_STRIDE1_PARAMETERS_URL,
  FULL_STRIDE1_VIEW_STATE_URL,
} from "./Components/deckgl/_deck-line-layer-map-adv/endpoints";
import MilSymbol from "./Components/milsymbol/MilSymbol";
import {
  airAssumedFriend,
  airFixedWingFriend,
  airFixedWingHostile,
  airFixedWingNeutral,
  airFixedWingUnknown,
  airFriend,
  airHostile,
  airNeutral,
  airPending,
  airSuspect,
  airUnknown,
  civilianAirFixedWingFriend,
} from "./Components/milsymbol/milSymbols";
import DefaultLayout from "./Layouts/DefaultLayout";

// MilSymbol cards
// #page= is the PDF's own page index, not the number printed on the page.
const MIL_STD_2525D_PDF = "http://www.mapsymbs.com/MilStd2525D.pdf";

// card-title link into the MIL-STD-2525D PDF, so each claim in a title points at its source page
function milStdPageLink(page, label) {
  return (
    <a
      className="link"
      href={`${MIL_STD_2525D_PDF}#page=${page}`}
      target="_blank"
      rel="noreferrer"
    >
      {label}
    </a>
  );
}

// one symbol + caption. boxClassName sizes the box, not the symbol — the speed leader
// runs outside the frame, so leader cards need a much bigger box than plain frames
function MilSymbolTile({ label, boxClassName = "h-24 w-24", ...symbolProps }) {
  return (
    <figure className="flex flex-col items-center gap-2">
      <div className={`flex ${boxClassName} items-center justify-center`}>
        <MilSymbol {...symbolProps} />
      </div>
      <figcaption className="text-xs text-pptx-cream">{label}</figcaption>
    </figure>
  );
}

export default function App() {
  // view state / render tuning for the Adv map's full_stride1 dataset, fetched
  // from the backend rather than hardcoded — this page has no router loader
  // like a full app would, so it's just a plain effect on mount. No auth
  // header, unlike where this pattern's ported from: nothing in this repo
  // gates these routes behind a token.
  const [advViewState, setAdvViewState] = useState(null);
  const [advRenderParameters, setAdvRenderParameters] = useState({});
  const [advConfig, setAdvConfig] = useState({});

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(FULL_STRIDE1_VIEW_STATE_URL).then((res) => res.json()),
      fetch(FULL_STRIDE1_PARAMETERS_URL).then((res) => res.json()),
      fetch(FULL_STRIDE1_CONFIG_URL).then((res) => res.json()),
    ])
      .then(([viewState, renderParameters, config]) => {
        if (cancelled) {
          return;
        }
        setAdvViewState(viewState);
        setAdvRenderParameters(renderParameters);
        setAdvConfig(config);
      })
      .catch(() => {
        // Backend not present yet (e.g. this component running standalone
        // without its dataset app) — map card just stays on the loading
        // placeholder instead of throwing.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // deck.gl's initialViewState needs real finite numbers the moment it
  // mounts — rendering with null/NaN before the fetch resolves would break
  // deck.gl outright, not just look wrong.
  const hasValidAdvViewState =
    Number.isFinite(advViewState?.longitude) &&
    Number.isFinite(advViewState?.latitude) &&
    Number.isFinite(advViewState?.zoom);

  const [toggleOn, setToggleOn] = useState(true);
  const [topPrimarySelected, setTopPrimarySelected] = useState(true);
  const [topSecondarySelected, setTopSecondarySelected] = useState(true);
  const [topDangerSelected, setTopDangerSelected] = useState(true);
  const [topPrimarySelectedSm, setTopPrimarySelectedSm] = useState(true);
  const [topSecondarySelectedSm, setTopSecondarySelectedSm] = useState(true);
  const [topDangerSelectedSm, setTopDangerSelectedSm] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(40);

  return (
    <DefaultLayout>
      <header className="flex items-start justify-between gap-4">
        <div>
          <Heading1>Component Style Guide</Heading1>
          <Muted>
            Core building blocks for the Interface Terminal frontend
          </Muted>
        </div>
        <Links to="/login" chevron="right" className="whitespace-nowrap mt-2">
          Login page
        </Links>
      </header>

      <Card title="Backend">
        <BackendStatus />
      </Card>

      <Card title="Buttons">
        <div className="flex gap-3 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="flex gap-2 flex-wrap mt-2">
          <Button variant="primary" size="sm">
            Primary
          </Button>
          <Button variant="secondary" size="sm">
            Secondary
          </Button>
          <Button variant="danger" size="sm">
            Danger
          </Button>
        </div>

        <Muted>
          <span className="mt-6 block text-xs uppercase tracking-wide">
            Click to toggle
          </span>
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
          <Button
            variant="danger"
            selected={topDangerSelected}
            onClick={() => setTopDangerSelected((v) => !v)}
          >
            Danger
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap mt-2">
          <Button
            variant="primary"
            size="sm"
            selected={topPrimarySelectedSm}
            onClick={() => setTopPrimarySelectedSm((v) => !v)}
          >
            Primary
          </Button>
          <Button
            variant="secondary"
            size="sm"
            selected={topSecondarySelectedSm}
            onClick={() => setTopSecondarySelectedSm((v) => !v)}
          >
            Secondary
          </Button>
          <Button
            variant="danger"
            size="sm"
            selected={topDangerSelectedSm}
            onClick={() => setTopDangerSelectedSm((v) => !v)}
          >
            Danger
          </Button>
        </div>

        <Muted>
          <span className="mt-6 block text-xs uppercase tracking-wide">
            Disabled
          </span>
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

        <Muted>
          <span className="mt-6 block text-xs uppercase tracking-wide">
            Outline
          </span>
        </Muted>
        <div className="flex gap-3 flex-wrap mt-2">
          <Button variant="outline-primary">Primary</Button>
          <Button variant="outline-secondary">Secondary</Button>
        </div>
        <div className="flex gap-2 flex-wrap mt-2">
          <Button variant="outline-primary" size="sm">
            Primary
          </Button>
          <Button variant="outline-secondary" size="sm">
            Secondary
          </Button>
        </div>
      </Card>

      <Card title="Form controls">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput label="Text input" placeholder="Enter value" />
          <Select
            label="Select"
            options={[
              { value: "a", label: "Option A" },
              { value: "b", label: "Option B" },
              { value: "c", label: "Option C" },
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
          <Toggle
            label="Toggle switch"
            checked={toggleOn}
            onChange={setToggleOn}
          />
        </div>
      </Card>

      <Card title="Dropdown (custom listbox)" className="relative z-20">
        <div className="max-w-xs">
          <Select2
            label="Node"
            required
            placeholder="Select a node"
            items={[
              { id: 1, val: "Relay A" },
              { id: 2, val: "Relay B" },
              { id: 3, val: "Relay C" },
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
          <span className="mt-6 block text-xs uppercase tracking-wide">
            No label
          </span>
        </Muted>
        <div className="flex gap-4 flex-wrap mt-2">
          <StatusLight status="info" />
          <StatusLight status="warning" />
          <StatusLight status="critical" />
          <StatusLight status="success" />
          <StatusLight status="neutral" />
        </div>

        <Muted>
          <span className="mt-6 block text-xs uppercase tracking-wide">
            Small
          </span>
        </Muted>
        <div className="flex gap-6 flex-wrap mt-2">
          <StatusLight status="info" size="sm">
            Info
          </StatusLight>
          <StatusLight status="warning" size="sm">
            Warning
          </StatusLight>
          <StatusLight status="critical" size="sm">
            Critical
          </StatusLight>
          <StatusLight status="success" size="sm">
            Online
          </StatusLight>
          <StatusLight status="neutral" size="sm">
            Neutral
          </StatusLight>
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
          <MetricTile
            label="RPM"
            value="1,842"
            status="info"
            delta="12"
            deltaDirection="up"
          />
          <MetricTile
            label="Vibration"
            value="0.34"
            unit="mm/s"
            status="success"
            delta="0.02"
            deltaDirection="down"
          />
          <MetricTile
            label="Bearing temp"
            value="86"
            unit="°C"
            status="warning"
            delta="3"
            deltaDirection="up"
          />
          <MetricTile
            label="Uptime"
            value="99.2"
            unit="%"
            status="neutral"
            delta="0"
            deltaDirection="flat"
          />
        </div>
      </Card>

      <Card title="Trend sparklines">
        <div className="flex gap-8 flex-wrap">
          <Sparkline
            label="Line pressure"
            status="info"
            data={[12, 14, 13, 16, 15, 18, 17, 19, 18, 21]}
          />
          <Sparkline
            label="Motor temp"
            status="warning"
            data={[60, 62, 61, 65, 68, 70, 74, 78, 76, 79]}
          />
          <Sparkline
            label="Fault count"
            status="critical"
            data={[0, 0, 1, 0, 2, 1, 3, 2, 4, 5]}
          />
        </div>
      </Card>

      <Card title="Alarm panel">
        <AlarmPanel
          alarms={[
            {
              id: 1,
              severity: "critical",
              message: "Relay node 7 link loss",
              time: "04:12:33 UTC",
            },
            {
              id: 2,
              severity: "warning",
              message: "Sensor array 3 latency above threshold",
              time: "04:10:02 UTC",
            },
            {
              id: 3,
              severity: "info",
              message: "Firmware update available for node 2",
              time: "03:58:47 UTC",
            },
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
            {
              label: "Overview",
              content: <Body>Overview panel content.</Body>,
            },
            { label: "Details", content: <Body>Details panel content.</Body> },
            {
              label: "Settings",
              content: <Body>Settings panel content.</Body>,
            },
          ]}
        />
      </Card>

      <Card title="Map — LineLayer (deck.gl)">
        <DeckLineLayerMap />
      </Card>

      <Card title="Map — LineLayer Adv (deck.gl + Channels WebSocket)">
        {/* The component is generic: which region to look at and how the
            dataset renders are this page's choice, not its own — all three
            come from the backend's full_stride1 dataset files rather than
            being hardcoded here, so this card starts working the moment that
            backend exists, no frontend changes needed. Height lives here
            too, since DeckLineLayerMapAdv takes its size from className. */}
        {hasValidAdvViewState ? (
          <div className="relative w-full h-[720px]">
            <DeckLineLayerMapAdv
              className="w-full h-full"
              initialViewState={advViewState}
              renderParameters={advRenderParameters}
              config={advConfig}
            />
          </div>
        ) : (
          <div className="relative w-full h-[720px] rounded-2xl overflow-hidden border border-pptx-blue/30 shadow-[0_0_30px_rgba(0,80,140,0.15)] flex items-center justify-center">
            <span className="text-white/70 text-sm">Loading map…</span>
          </div>
        )}
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
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setModalOpen(false)}
              >
                Confirm
              </Button>
            </>
          }
        >
          This will restart the affected subsystem. Continue?
        </Modal>
        <Modal
          open={infoModalOpen}
          title="Firmware up to date"
          onClose={() => setInfoModalOpen(false)}
        />
        <Modal
          open={dangerModalOpen}
          title="Delete node record"
          onClose={() => setDangerModalOpen(false)}
          footer={
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDangerModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setDangerModalOpen(false)}
              >
                Delete
              </Button>
            </>
          }
        >
          This will permanently remove the node record. This action cannot be
          undone.
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
        <Slider
          label="Threshold"
          min={0}
          max={100}
          value={sliderValue}
          onChange={setSliderValue}
        />
      </Card>

      <Card title="Accordion">
        <Accordion
          items={[
            {
              title: "Diagnostics",
              content: (
                <ul className="list-disc pl-4 space-y-1">
                  <li>All diagnostic checks passed at 04:12 UTC.</li>
                  <li>14 of 14 sensor nodes reporting, no faults detected.</li>
                  <li>
                    Firmware v3.2.1 running on all nodes, no updates pending.
                  </li>
                </ul>
              ),
            },
            {
              title: "Maintenance",
              content: (
                <ul className="list-disc pl-4 space-y-1">
                  <li>Last maintenance performed 3 days ago.</li>
                  <li>Uplink stable, 12ms average latency.</li>
                  <li>Main and backup power rails nominal, 98% capacity.</li>
                </ul>
              ),
            },
            {
              title: "Security",
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
            { key: "id", label: "ID" },
            { key: "name", label: "Node" },
            { key: "status", label: "Status" },
          ]}
          rows={[
            {
              id: "001",
              name: "Relay A",
              status: <Badge status="success">Online</Badge>,
            },
            {
              id: "002",
              name: "Relay B",
              status: <Badge status="success">Online</Badge>,
            },
            {
              id: "003",
              name: "Relay C",
              status: <Badge status="warning">Degraded</Badge>,
            },
          ]}
        />
      </Card>

      <Card title="Breadcrumb & pagination">
        <div className="flex flex-col gap-4">
          <Breadcrumb items={["Home", "Operations", "Relay nodes"]} />
          <Pagination pageCount={5} />
        </div>
      </Card>

      <Card
        title={
          <>
            MIL-STD-2525D — air frames with speed leader and speed label (
            {milStdPageLink(28, "frames PDF p.28")},{" "}
            {milStdPageLink(46, "speed leader PDF pp.46–47")})
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <MilSymbolTile
            symbol={airPending}
            course={30}
            speedKnots={150}
            size={40}
            boxClassName="h-64 w-64"
            label="Pending, 030°, 150 kt"
          />
          <MilSymbolTile
            symbol={airUnknown}
            course={300}
            speedKnots={350}
            size={40}
            boxClassName="h-64 w-64"
            label="Unknown, 300°, 350 kt"
          />
          <MilSymbolTile
            symbol={airFriend}
            course={90}
            speedKnots={650}
            size={40}
            boxClassName="h-64 w-64"
            label="Friend, 090°, 650 kt"
          />
          <MilSymbolTile
            symbol={airNeutral}
            course={180}
            speedKnots={250}
            showSpeedLabel
            size={40}
            boxClassName="h-64 w-64"
            label="Neutral, 180°, 250 kt + label"
          />
          <MilSymbolTile
            symbol={airHostile}
            course={225}
            speedKnots={500}
            showSpeedLabel
            size={40}
            boxClassName="h-64 w-64"
            label="Hostile, 225°, 500 kt + label"
          />
          <MilSymbolTile
            symbol={airAssumedFriend}
            course={0}
            speedKnots={450}
            size={40}
            boxClassName="h-64 w-64"
            label="Assumed friend, 000°, 450 kt"
          />
          <MilSymbolTile
            symbol={airSuspect}
            course={135}
            size={40}
            boxClassName="h-64 w-64"
            label="Suspect, 135°, no speed (arrow)"
          />
        </div>
      </Card>

      <Card title="Engine type and behaviour labels (custom, not part of MIL-STD-2525D)">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <MilSymbolTile
            symbol={airFixedWingFriend}
            course={45}
            speedKnots={250}
            showSpeedLabel
            engineType="SEP"
            showEngineTypeLabel
            behaviour="ASC"
            showBehaviourLabel
            size={40}
            boxClassName="h-64 w-64"
            label="Friend, SEP, ASC + speed"
          />
          <MilSymbolTile
            symbol={airFixedWingHostile}
            course={270}
            speedKnots={450}
            showSpeedLabel
            engineType="JET"
            showEngineTypeLabel
            behaviour="CRZ"
            showBehaviourLabel
            size={40}
            boxClassName="h-64 w-64"
            label="Hostile, JET, CRZ + speed"
          />
          <MilSymbolTile
            symbol={civilianAirFixedWingFriend}
            course={200}
            speedKnots={180}
            showSpeedLabel
            engineType="MEP"
            showEngineTypeLabel
            behaviour="DES"
            showBehaviourLabel
            size={40}
            boxClassName="h-64 w-64"
            label="Civilian, MEP, DES + speed"
          />
          <MilSymbolTile
            symbol={airFixedWingNeutral}
            course={135}
            speedKnots={120}
            engineType="SET"
            showEngineTypeLabel
            behaviour="TGO"
            showBehaviourLabel
            size={40}
            boxClassName="h-64 w-64"
            label="Neutral, SET, TGO"
          />
          <MilSymbolTile
            symbol={airFixedWingUnknown}
            course={0}
            speedKnots={300}
            engineType="MET"
            showEngineTypeLabel
            behaviour="HOLD"
            showBehaviourLabel
            size={40}
            boxClassName="h-64 w-64"
            label="Unknown, MET, HOLD"
          />
        </div>
        <dl className="mt-4 ml-auto w-fit grid grid-cols-[auto_auto] gap-x-3 gap-y-1 text-xs text-pptx-cream">
          <dt className="font-semibold">SEP</dt>
          <dd>Single engine piston</dd>
          <dt className="font-semibold">MEP</dt>
          <dd>Multi engine piston</dd>
          <dt className="font-semibold">SET</dt>
          <dd>Single engine turboprop</dd>
          <dt className="font-semibold">MET</dt>
          <dd>Multi engine turboprop</dd>
          <dt className="font-semibold">JET</dt>
          <dd>Jet</dd>
          <dt className="font-semibold mt-2">ASC</dt>
          <dd className="mt-2">Ascend</dd>
          <dt className="font-semibold">DES</dt>
          <dd>Descend</dd>
          <dt className="font-semibold">CRZ</dt>
          <dd>Cruise</dd>
          <dt className="font-semibold">TGO</dt>
          <dd>Touch-and-go</dd>
          <dt className="font-semibold">HOLD</dt>
          <dd>Holding pattern</dd>
        </dl>
      </Card>
    </DefaultLayout>
  );
}
