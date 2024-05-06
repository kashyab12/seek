from dataclasses import dataclass
from pathlib import Path
from desktop_parser import DesktopFile

@dataclass
class DesktopAction:
    app_path: Path
    def get_exec(self) -> Path:
        # Parse file
        desktop_file = DesktopFile.from_file(self.app_path)
        # todo: what's a more general solution? Just find the 1st exec? Find all and disp?
        if "google-chrome.desktop" in str(self.app_path):
            return desktop_file.data["Desktop Action new-window"]['Exec']
        else:
            return list(find("Exec", desktop_file))[0]
        
def find(key, value):
  for k, v in value.items():
    if k == key:
      yield v
    elif isinstance(v, dict):
      for result in find(key, v):
        yield result
    elif isinstance(v, list):
      for d in v:
        for result in find(key, d):
          yield result
