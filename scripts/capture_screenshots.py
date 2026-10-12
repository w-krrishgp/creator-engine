import subprocess
import os
import time

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
base_dir = r"c:\Users\Dell\creator-engine"

screenshots = [
    ("http://localhost:3000/roadmap", os.path.join(base_dir, "screenshot_roadmap.png")),
    ("http://localhost:3000/opportunities", os.path.join(base_dir, "screenshot_opportunities.png")),
    ("http://localhost:3000/monetisation", os.path.join(base_dir, "screenshot_monetisation.png")),
    ("http://localhost:3000/actions", os.path.join(base_dir, "screenshot_actions.png")),
]

for url, out_path in screenshots:
    cmd = [
        edge_path,
        "--headless=new",
        "--disable-gpu",
        f"--screenshot={out_path}",
        "--window-size=1280,800",
        url
    ]
    print(f"Capturing {url} -> {out_path}...")
    subprocess.run(cmd, check=True)
    time.sleep(1)

print("All screenshots captured successfully.")
