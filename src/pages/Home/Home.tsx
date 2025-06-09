import { Box, Flex } from '@chakra-ui/react';
import HomeHeader from '../../components/home/HomeHeader';
import QuestionInputBox from '../../components/home/QuestionInputBox';
import QuestionCard from '../../components/home/QuestionCard';
import LoadMoreButton from '../../components/home/LoadMoreButton';
import HomeLayout from '../../components/home/HomeLayout';

const Home = () => {
  return (
    <HomeLayout>
      <HomeHeader />

      {/* Main Content Area */}
      <Flex justify="center" p="16px">
        <Box maxW="720px" width="full">
          <QuestionInputBox />

          {/* Question Cards will go here */}
          <QuestionCard />
        </Box>
      </Flex>
      {/* Load More Button */}
      <Flex justify="center" mt="24px">
        <LoadMoreButton />
      </Flex>
    </HomeLayout>
  );
};

export default Home; 