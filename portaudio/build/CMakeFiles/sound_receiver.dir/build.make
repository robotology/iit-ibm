# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.10

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/gdangelo/workspace/yarp/example/portaudio

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/gdangelo/workspace/yarp/example/portaudio/build

# Include any dependencies generated for this target.
include CMakeFiles/sound_receiver.dir/depend.make

# Include the progress variables for this target.
include CMakeFiles/sound_receiver.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/sound_receiver.dir/flags.make

CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o: CMakeFiles/sound_receiver.dir/flags.make
CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o: ../sound_receiver.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/gdangelo/workspace/yarp/example/portaudio/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o"
	/usr/bin/g++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o -c /home/gdangelo/workspace/yarp/example/portaudio/sound_receiver.cpp

CMakeFiles/sound_receiver.dir/sound_receiver.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/sound_receiver.dir/sound_receiver.cpp.i"
	/usr/bin/g++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/gdangelo/workspace/yarp/example/portaudio/sound_receiver.cpp > CMakeFiles/sound_receiver.dir/sound_receiver.cpp.i

CMakeFiles/sound_receiver.dir/sound_receiver.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/sound_receiver.dir/sound_receiver.cpp.s"
	/usr/bin/g++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/gdangelo/workspace/yarp/example/portaudio/sound_receiver.cpp -o CMakeFiles/sound_receiver.dir/sound_receiver.cpp.s

CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o.requires:

.PHONY : CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o.requires

CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o.provides: CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o.requires
	$(MAKE) -f CMakeFiles/sound_receiver.dir/build.make CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o.provides.build
.PHONY : CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o.provides

CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o.provides.build: CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o


# Object files for target sound_receiver
sound_receiver_OBJECTS = \
"CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o"

# External object files for target sound_receiver
sound_receiver_EXTERNAL_OBJECTS =

sound_receiver: CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o
sound_receiver: CMakeFiles/sound_receiver.dir/build.make
sound_receiver: /home/gdangelo/workspace/yarp/build/lib/libYARP_dev.so.2.3.72
sound_receiver: /home/gdangelo/workspace/yarp/build/lib/libYARP_name.so.2.3.72
sound_receiver: /home/gdangelo/workspace/yarp/build/lib/libYARP_init.so.2.3.72
sound_receiver: /home/gdangelo/workspace/yarp/build/lib/libYARP_math.so.2.3.72
sound_receiver: /home/gdangelo/workspace/yarp/build/lib/libYARP_sig.so.2.3.72
sound_receiver: /home/gdangelo/workspace/yarp/build/lib/libYARP_OS.so.2.3.72
sound_receiver: CMakeFiles/sound_receiver.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/home/gdangelo/workspace/yarp/example/portaudio/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Linking CXX executable sound_receiver"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/sound_receiver.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/sound_receiver.dir/build: sound_receiver

.PHONY : CMakeFiles/sound_receiver.dir/build

CMakeFiles/sound_receiver.dir/requires: CMakeFiles/sound_receiver.dir/sound_receiver.cpp.o.requires

.PHONY : CMakeFiles/sound_receiver.dir/requires

CMakeFiles/sound_receiver.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/sound_receiver.dir/cmake_clean.cmake
.PHONY : CMakeFiles/sound_receiver.dir/clean

CMakeFiles/sound_receiver.dir/depend:
	cd /home/gdangelo/workspace/yarp/example/portaudio/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/gdangelo/workspace/yarp/example/portaudio /home/gdangelo/workspace/yarp/example/portaudio /home/gdangelo/workspace/yarp/example/portaudio/build /home/gdangelo/workspace/yarp/example/portaudio/build /home/gdangelo/workspace/yarp/example/portaudio/build/CMakeFiles/sound_receiver.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/sound_receiver.dir/depend
