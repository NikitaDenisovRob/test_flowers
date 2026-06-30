# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"Test flowers" is a Python project (PyCharm/PyCharm Community) with a miniconda Python environment. The repo has two top-level directories:

- `Backend/` — server-side code (currently empty)
- `Frontend/` — client-side code (currently empty). Если будешь делать, делай связку React + Vite

The project is in early/initial setup — no source files, dependencies, or configuration have been committed yet.

## Python environment

The project is configured to use the miniconda base environment at `/usr/local/Caskroom/miniconda/base`. When commands are added, activate the environment first:

```bash
conda activate base
```

## Правила
- Не делай скриншоты и не используй Playwright для самопроверки.
- Не устанавливай браузеры для верификации.
- Я проверяю результат сам в браузере на localhost.
- После изменений просто кратко скажи что сделал.

Once `Backend/` and `Frontend/` are populated with their respective dependency files (e.g. `requirements.txt`, `pyproject.toml`, `package.json`), update this file with the actual build, lint, and test commands.
