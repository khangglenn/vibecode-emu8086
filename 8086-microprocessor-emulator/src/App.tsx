import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  StepForward, 
  RotateCcw, 
  Cpu, 
  Code, 
  Database, 
  Terminal,
  Settings,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Emulator, INITIAL_REGISTERS, Registers } from './emulator';

const DEFAULT_CODE = `; Simple 8086 Program
MOV AX, 5
MOV BX, 10
ADD AX, BX
INC AX
MOV CX, AX
HLT`;

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [registers, setRegisters] = useState<Registers>(INITIAL_REGISTERS);
  const [currentLine, setCurrentLine] = useState(-1);
  const [isHalted, setIsHalted] = useState(false);
  const [memoryView, setMemoryView] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'registers' | 'memory'>('registers');
  
  const emulatorRef = useRef(new Emulator());

  useEffect(() => {
    // Initial memory view
    setMemoryView(Array.from(emulatorRef.current.state.memory.slice(0, 64)));
  }, []);

  const handleAssemble = () => {
    emulatorRef.current.reset();
    emulatorRef.current.state.instructions = code.split('\n');
    setRegisters({ ...emulatorRef.current.state.registers });
    setCurrentLine(-1);
    setIsHalted(false);
  };

  const handleStep = () => {
    if (currentLine === -1 && !isHalted) {
      emulatorRef.current.state.instructions = code.split('\n');
    }
    emulatorRef.current.step();
    setRegisters({ ...emulatorRef.current.state.registers });
    setCurrentLine(emulatorRef.current.state.currentLine);
    setIsHalted(emulatorRef.current.state.isHalted);
    setMemoryView(Array.from(emulatorRef.current.state.memory.slice(0, 64)));
  };

  const handleRun = () => {
    if (currentLine === -1) {
      emulatorRef.current.state.instructions = code.split('\n');
    }
    
    const runInterval = setInterval(() => {
      if (emulatorRef.current.state.isHalted) {
        clearInterval(runInterval);
        setIsHalted(true);
        return;
      }
      emulatorRef.current.step();
      setRegisters({ ...emulatorRef.current.state.registers });
      setCurrentLine(emulatorRef.current.state.currentLine);
      setMemoryView(Array.from(emulatorRef.current.state.memory.slice(0, 64)));
    }, 100);
  };

  const handleReset = () => {
    emulatorRef.current.reset();
    setRegisters({ ...emulatorRef.current.state.registers });
    setCurrentLine(-1);
    setIsHalted(false);
    setMemoryView(Array.from(emulatorRef.current.state.memory.slice(0, 64)));
  };

  const formatHex = (val: number, bits: number = 16) => {
    const hex = val.toString(16).toUpperCase();
    const padding = bits / 4;
    return '0'.repeat(Math.max(0, padding - hex.length)) + hex;
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Cpu className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">EMU8086 Web</h1>
            <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Microprocessor Simulator v1.0</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleReset}
            className="p-2 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button 
            onClick={handleAssemble}
            className="px-4 py-2 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors font-mono text-sm uppercase"
          >
            Assemble
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-73px)]">
        {/* Code Editor Section */}
        <section className="lg:col-span-5 border-r border-[#141414] flex flex-col">
          <div className="p-3 border-b border-[#141414] flex items-center justify-between bg-[#D4D3D0]">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span className="text-xs font-mono uppercase font-bold">Source Editor</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleStep}
                disabled={isHalted}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#141414] transition-colors uppercase"
              >
                <StepForward className="w-3 h-3" /> Step
              </button>
              <button 
                onClick={handleRun}
                disabled={isHalted}
                className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono border border-[#141414] bg-[#141414] text-[#E4E3E0] hover:bg-opacity-80 disabled:opacity-30 transition-colors uppercase"
              >
                <Play className="w-3 h-3" /> Run
              </button>
            </div>
          </div>
          <div className="flex-1 relative font-mono text-sm">
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#D4D3D0] border-r border-[#141414] flex flex-col items-center pt-4 opacity-50 select-none">
              {code.split('\n').map((_, i) => (
                <div key={i} className={`h-6 flex items-center ${currentLine === i ? 'text-[#141414] font-bold opacity-100' : ''}`}>
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full pl-12 pr-4 py-4 bg-transparent resize-none focus:outline-none leading-6"
              spellCheck={false}
            />
            {currentLine !== -1 && (
              <div 
                className="absolute left-10 right-0 h-6 bg-[#141414] bg-opacity-10 pointer-events-none transition-all duration-100"
                style={{ top: `${currentLine * 24 + 16}px` }}
              />
            )}
          </div>
        </section>

        {/* Visualization Section */}
        <section className="lg:col-span-7 flex flex-col bg-[#F0EFEC]">
          {/* Tabs */}
          <div className="flex border-b border-[#141414]">
            <button 
              onClick={() => setActiveTab('registers')}
              className={`px-6 py-3 text-xs font-mono uppercase tracking-widest border-r border-[#141414] transition-colors ${activeTab === 'registers' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#D4D3D0]'}`}
            >
              Registers
            </button>
            <button 
              onClick={() => setActiveTab('memory')}
              className={`px-6 py-3 text-xs font-mono uppercase tracking-widest border-r border-[#141414] transition-colors ${activeTab === 'memory' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#D4D3D0]'}`}
            >
              Memory
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'registers' ? (
                <motion.div 
                  key="registers"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {Object.entries(registers).map(([name, value]) => (
                    <div key={name} className="border border-[#141414] p-3 bg-white shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-mono uppercase opacity-50">{name}</span>
                        <Settings className="w-3 h-3 opacity-20" />
                      </div>
                      <div className="text-2xl font-mono font-bold tracking-tighter">
                        {formatHex(value as number)}
                        <span className="text-[10px] ml-1 opacity-30">h</span>
                      </div>
                      <div className="text-[10px] font-mono opacity-40 mt-1">
                        DEC: {value as number}
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="memory"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-[#141414] p-4 font-mono text-xs shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
                >
                  <div className="grid grid-cols-9 gap-2 mb-4 border-b border-[#141414] pb-2 opacity-50">
                    <div>ADDR</div>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i}>+{i.toString(16).toUpperCase()}</div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {Array.from({ length: 8 }).map((_, rowIndex) => (
                      <div key={rowIndex} className="grid grid-cols-9 gap-2">
                        <div className="opacity-50">{formatHex(rowIndex * 8, 16)}</div>
                        {memoryView.slice(rowIndex * 8, (rowIndex + 1) * 8).map((val, colIndex) => (
                          <div key={colIndex} className={`hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors cursor-default ${val !== 0 ? 'font-bold' : 'opacity-30'}`}>
                            {formatHex(val, 8)}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Panel */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-[#141414] p-4 bg-[#D4D3D0]">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase font-bold">System Status</span>
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span>Processor State</span>
                    <span className={isHalted ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                      {isHalted ? 'HALTED' : 'RUNNING'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>IP (Instruction Pointer)</span>
                    <span>{formatHex(registers.ip)}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stack Pointer</span>
                    <span>{formatHex(registers.sp)}h</span>
                  </div>
                </div>
              </div>

              <div className="border border-[#141414] p-4 bg-[#D4D3D0]">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase font-bold">Quick Help</span>
                </div>
                <ul className="text-[10px] font-mono space-y-1 opacity-70">
                  <li>• MOV dest, src - Move data</li>
                  <li>• ADD dest, src - Addition</li>
                  <li>• SUB dest, src - Subtraction</li>
                  <li>• INC dest - Increment</li>
                  <li>• HLT - Halt execution</li>
                  <li>• Use 'h' suffix for hex (e.g. 10h)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#141414] p-2 bg-[#141414] text-[#E4E3E0] flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
        <div>8086 Instruction Set Architecture Simulator</div>
        <div className="flex gap-4">
          <span>Mem: 1024 KB</span>
          <span>Clock: 4.77 MHz (Simulated)</span>
        </div>
      </footer>
    </div>
  );
}
