-- The consultation form no longer asks for a call time; older requests keep theirs.
ALTER TABLE `consultation_requests` MODIFY `call_time` VARCHAR(32) NULL;
