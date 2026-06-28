export default function AboutJetVideo() {
    return (
        <div className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden rounded-3xl">
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
                src="/videos/about-jet-bg.mp4"
            />
        </div>
    );
}
