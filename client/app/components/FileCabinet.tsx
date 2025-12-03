'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface ArchiveEvent {
	id: number;
	title: string;
	folder_color: string;
	description: string;
	event_date: string;
	category: string;
}

interface ArchiveImage {
	id: number;
	image_url: string;
	caption: string;
}

export default function FileCabinet() {
	const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
	const [folders, setFolders] = useState<ArchiveEvent[]>([]);
	const [loading, setLoading] = useState(false);
	
	// State for the "Open Folder" Modal
	const [selectedEvent, setSelectedEvent] = useState<ArchiveEvent | null>(null);
	const [eventImages, setEventImages] = useState<ArchiveImage[]>([]);
	const [loadingImages, setLoadingImages] = useState(false);

	// State for the "Full Screen Image" (Lightbox)
	const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

	const drawers = [
		{ id: 'concerts', label: 'Concerts', color: 'bg-red-400' },
		{ id: 'speakers', label: 'Speakers', color: 'bg-red-300' },
		{ id: 'films', label: 'Films', color: 'bg-pink-300' }
	];

	// 1. Open Drawer (Fetch list of events)
	const openDrawer = async (category: string) => {
		if (activeDrawer === category) return;
		setActiveDrawer(category);
		setLoading(true);

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/archive/${category}`);
			const json = await res.json();
			if (json.success) setFolders(json.data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// 2. Open Folder (Fetch images for specific event)
	const handleFolderClick = async (event: ArchiveEvent) => {
		setSelectedEvent(event); 
		setLoadingImages(true);

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/archive/event/${event.id}`);
			const json = await res.json();
			if (json.success) setEventImages(json.data);
		} catch (err) {
			console.error("Failed to fetch images:", err);
		} finally {
			setLoadingImages(false);
		}
	};

	const closeFolder = () => {
		setSelectedEvent(null);
		setEventImages([]);
	};

	return (
		<div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto p-10 min-h-screen relative">
			<h1 className="text-3xl font-bold mb-8 text-black">ARCHIVE</h1>

			{/* --- CABINET DRAWERS --- */}
			{drawers.map((drawer) => (
				<div 
					key={drawer.id} 
					className="w-full relative z-10"
					onMouseEnter={() => openDrawer(drawer.id)}
					onMouseLeave={() => setActiveDrawer(null)}
				>
					{/* Drawer Handle */}
					<div className={`${drawer.color} h-32 w-full rounded-lg border-4 border-red-500 flex items-center justify-center shadow-lg relative z-20 transition-transform duration-300`}>
						<div className="bg-white px-6 py-2 border-2 border-red-500 rounded text-black font-bold shadow-sm select-none">
							{drawer.label}
						</div>
					</div>

					{/* Drawer Content (Folders) */}
					<AnimatePresence>
						{activeDrawer === drawer.id && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								className="bg-red-100 border-x-4 border-b-4 border-red-500 mx-4 rounded-b-lg overflow-hidden relative z-10 -mt-1"
							>
								<div className="p-4 flex flex-col gap-2 pt-4">
									{loading ? (
										<p className="text-center text-gray-500 text-sm py-4">Fetching...</p>
									) : (
										folders.map((folder) => (
											<FolderItem 
												key={folder.id} 
												event={folder} 
												onClick={() => handleFolderClick(folder)} 
											/>
										))
									)}
									{!loading && folders.length === 0 && (
										<p className="text-center text-gray-400 text-sm py-2">Empty Drawer</p>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			))}

			{/* --- FOLDER MODAL (Event Description + Grid) --- */}
			<AnimatePresence>
				{selectedEvent && (
					<motion.div 
						initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
						className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
						onClick={closeFolder}
					>
						<motion.div 
							initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
							className="bg-white w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-xl shadow-2xl flex flex-col"
							onClick={(e: React.MouseEvent) => e.stopPropagation()} 
						>
							{/* Header */}
							<div className="p-6 border-b flex justify-between items-start" style={{ backgroundColor: selectedEvent.folder_color || '#F4D35E' }}>
								<div>
									<h2 className="text-3xl font-bold text-black">{selectedEvent.title}</h2>
									<p className="text-black/80 font-medium mt-1">
										{new Date(selectedEvent.event_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
									</p>
								</div>
								<button 
									onClick={closeFolder} 
									className="bg-black/10 hover:bg-black/20 rounded-full p-2 w-10 h-10 flex items-center justify-center text-black font-bold transition-colors"
								>
									✕
								</button>
							</div>

							{/* Scrollable Content */}
							<div className="p-8 overflow-y-auto">
								<div className="prose max-w-none mb-8">
									<h3 className="text-xl font-bold text-gray-800 mb-2">About this Event</h3>
									<p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
										{selectedEvent.description || "No description available."}
									</p>
								</div>

								<div className="border-t pt-8">
									<h3 className="text-xl font-bold text-gray-800 mb-4">Event Gallery</h3>
									
									{loadingImages ? (
										<div className="flex justify-center items-center py-12">
											<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
										</div>
									) : (
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{eventImages.map((img) => (
												<div 
													key={img.id} 
													className="group relative cursor-zoom-in aspect-square overflow-hidden rounded-lg bg-gray-100"
													onClick={() => setFullScreenImage(img.image_url)}
												>
													<img 
														src={img.image_url} 
														alt={img.caption || 'Event photo'} 
														className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
													/>
													<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
												</div>
											))}
											{eventImages.length === 0 && (
												<p className="text-gray-400 col-span-full text-center py-8 bg-gray-50 rounded-lg">
													No photos found for this event.
												</p>
											)}
										</div>
									)}
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* --- LIGHTBOX (Full Screen Image) --- */}
			<AnimatePresence>
				{fullScreenImage && (
					<motion.div 
						initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
						onClick={() => setFullScreenImage(null)}
					>
						<button 
							className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center text-2xl transition-colors"
							onClick={() => setFullScreenImage(null)}
						>
							✕
						</button>

						<motion.img 
							initial={{ scale: 0.9, opacity: 0 }} 
							animate={{ scale: 1, opacity: 1 }} 
							exit={{ scale: 0.9, opacity: 0 }}
							src={fullScreenImage} 
							alt="Full screen view" 
							className="max-w-full max-h-screen object-contain shadow-2xl rounded-sm"
							onClick={(e: React.MouseEvent) => e.stopPropagation()}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

// --- Folder Item Component ---
function FolderItem({ event, onClick }: { event: ArchiveEvent, onClick: () => void }) {
	const tabPositions = ['self-start', 'self-center', 'self-end'];
	const pos = tabPositions[event.id % 3];

	return (
		<div onClick={onClick} className="cursor-pointer hover:-translate-y-2 transition-transform duration-300 group">
			<div className={`w-1/3 h-4 rounded-t-lg ${pos}`} style={{ backgroundColor: event.folder_color || '#F4D35E' }}></div>
			<div 
				className="h-14 w-full rounded-b-lg rounded-tr-lg shadow-sm flex items-center px-4 group-hover:shadow-md border-b-2 border-black/10"
				style={{ backgroundColor: event.folder_color || '#F4D35E' }}
			>
				<span className="font-bold text-gray-800 text-sm truncate">{event.title}</span>
			</div>
		</div>
	);
}
