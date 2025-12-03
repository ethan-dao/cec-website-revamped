import FileCabinet from '../components/FileCabinet';

export default function ArchivePage() {
  return (
    <main className="min-h-screen bg-blue-100 flex flex-col items-center justify-center p-8">
      {/* render the file cabinet */}
      <FileCabinet />
    </main>
  );
}