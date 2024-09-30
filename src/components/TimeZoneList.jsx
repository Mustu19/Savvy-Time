import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Slider from './Slider';
import TimezoneSearch from './TimeZoneSearch';

function TimezoneList({ sliderTime, setSliderTime, timezones, setTimezones }) {
  const addTimezone = (timezone) => {
    if (!timezones.includes(timezone)) {
      setTimezones((prev) => [...prev, timezone]);
    }
  };

  const removeTimezone = (index) => {
    setTimezones((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTimezones = Array.from(timezones);
    const [movedItem] = reorderedTimezones.splice(result.source.index, 1);
    reorderedTimezones.splice(result.destination.index, 0, movedItem);
    setTimezones(reorderedTimezones);
  };

  return (
    <div className="p-4 bg-white text-black">
      <TimezoneSearch onAddTimezone={addTimezone} />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="timezones">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="bg-gray-100 rounded-lg p-4 space-y-2"
            >
              {timezones.map((timezone, index) => (
                <Draggable key={timezone} draggableId={timezone} index={index}>
                  {(provided) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="bg-white p-4 rounded-md flex flex-col items-start shadow"
                    >
                      <Slider
                        sliderTime={sliderTime.clone().tz(timezone)}
                        setSliderTime={setSliderTime}
                        timezone={timezone}
                      />
                      <button
                        onClick={() => removeTimezone(index)}
                        className="text-red-500 mt-2"
                      >
                        ✖
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default TimezoneList;
