# results-viewer

## Overview

The goal of this project is to create a user-friendly UI that summarizes and draws conclusions from custom profiling sessions of tasks that ran on a WPF dispatcher. The profiling data is provided in a JSON format.

## Input Data Structure

The JSON file contains the following fields:

- exported_at: The date and time when the profiling data was exported.
- total_run_time: The total run time of the profiling session.
- tasks: An array of tasks, each with the following fields:
- time_in_queue: The time the task spent in the queue.
- actual_run_time: The actual run time of the task.
- is_probably_redundant: A boolean indicating whether the task is likely redundant.
- priority: The priority of the task.
- origin_name: The name of the function that originated the task.
- created_at: The date and time when the task was created.

## Product specifications

### User flow

- User drags/selects JSON input file

- Summary View: Display a summary of the profiling session. Inspired by dotMemory's UX, this view should display some conclusions based on the data to help users identify performance issues. We could highlight actual run time and waiting time 1st, then present conclusions related to redundancy/priority. We might also want to show a timeline of tasks to help visualize queue congestion (but it has a high cost of development and fairly low value)

- Task List: The summary view should have at least 1 point of interaction that leads to a table that displays all tasks (grouped by the name identifier). Again, inspired by dotMemory, a click on the row shall take the user to a table that displays only the tasks from that same group (this time not grouping them)

### Conclusions that can be drawn from the data

- Tasks that occupied a long time on the UI thread
- Tasks that waited a long time in the queue
- Something about priorities...
- Potential redundancies (tasks dispatched from UI thread)
