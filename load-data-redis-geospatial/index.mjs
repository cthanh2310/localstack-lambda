import Redis from 'ioredis';
import middy from '@middy/core';
import warmup from '@middy/warmup';
import eventNormalizer from '@middy/event-normalizer';

const redis = new Redis({
  // redis-local is the hostname of the Redis container in the local environment having the same network with the Lambda function
  host: process.env.REDIS_HOST || 'redis-local',
  port: Number(process.env.REDIS_PORT || 6379),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
});

console.log('Redis connection:', redis);

const syncClinicData = async (event) => {
  const {
    payload: { id, latitude, longitude },
    actionType,
  } = event;
  console.log('[SYNC_CLINIC_DATA_LAMBDA_LOG] Clinic data:', {
    id,
    latitude,
    longitude,
    actionType,
  });

  try {
    switch (actionType) {
      case 'CREATE':
      case 'UPDATE':
        // Use the GEOADD command to sync clinic location to a geospatial index in Redis
        await redis.geoadd(
          process.env.GEOSPATIAL_INDEX_NAME || 'location',
          longitude,
          latitude,
          id
        );
        break;

      case 'DELETE':
        // Use the ZREM command to remove clinic location from a geospatial index in Redis
        await redis.zrem(process.env.GEOSPATIAL_INDEX_NAME || 'location', id);
        break;
      default:
        console.log(
          '[SYNC_CLINIC_DATA_LAMBDA_LOG] Invalid action type:',
          actionType
        );
        break;
    }

    console.log(
      `[SYNC_CLINIC_DATA_LAMBDA_LOG] Clinic data synced successfully for (ID: ${id}), action type: ${actionType}`
    );
  } catch (err) {
    console.error(
      `[SYNC_CLINIC_DATA_LAMBDA_LOG] Failed to sync clinic data for (ID: ${id}):`,
      err
    );
  }
};

export const handler = middy(syncClinicData)
  .use(warmup())
  .use(eventNormalizer());
