import { useEffect } from 'react';
import { getEcho } from '../lib/echo';
import toast from 'react-hot-toast';

export const useEcho = (channelName, eventName, callback) => {
  useEffect(() => {
    if (!channelName || !eventName || !callback) return;

    const echoInstance = getEcho();
    if (!echoInstance) return; // Echo not configured, skip

    const channel = echoInstance.channel(channelName);

    channel.listen(eventName, (e) => {
      callback(e);
      if (e.message) {
        toast(e.message, { icon: '🔔' });
      }
    });

    return () => {
      channel.stopListening(eventName);
      echoInstance.leaveChannel(channelName);
    };
  }, [channelName, eventName, callback]);
};
